import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openrouter } from '@/lib/openrouter'
import fs from 'fs'
import path from 'path'

export const maxDuration = 30 

const CACHE_DIR = path.join(process.cwd(), '.genting-cache', 'quizzes')
 
interface QuizQuestion {
  question: string
  options: string[]
  answer: number
}

// Fallback kuis lokal jika AI benar-benar "Zonk" (biar Bunda tidak API Error)
const LOCAL_FALLBACKS: Record<number, QuizQuestion[]> = {
  1: [
    { question: "Apa itu stunting?", options: ["Kondisi kurang gizi kronis", "Anak terlalu gemuk", "Anak rajin makan", "Anak suka tidur"], answer: 0 },
    { question: "Kapan masa emas pencegahan stunting?", options: ["100 HPK", "1000 HPK", "Umur 5 tahun", "Umur 10 tahun"], answer: 1 },
    { question: "Salah satu penyebab stunting adalah...", options: ["Kurang asupan protein", "Kebanyakan minum air", "Sering olahraga", "Kurang tidur"], answer: 0 }
  ]
}

const GENERIC_FALLBACK: QuizQuestion[] = [
  { question: "Mengapa nutrisi penting bagi ibu hamil?", options: ["Untuk kesehatan janin", "Biar kenyang saja", "Agar cepat tidur", "Biar kulit putih"], answer: 0 },
  { question: "Apa itu 1000 HPK?", options: ["1000 Hari Pertama Kehidupan", "1000 Halaman Pendidikan Kesehatan", "1000 Hari Pasca Kelahiran", "1000 Jam Pertama Kelahiran"], answer: 0 },
  { question: "Sumber protein hewani contohnya...", options: ["Telur dan Ikan", "Nasi dan Jagung", "Jeruk dan Apel", "Sawi dan Bayam"], answer: 0 }
]

export async function POST(req: NextRequest) {
  let requestData: { content?: string; title?: string; day?: number } = {}
  try {
    requestData = await req.json()
    const { content, title, day } = requestData

    if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 })

    // 1. TIER 1: SMART CACHE (Instan & Gratis)
    if (day) {
      const cachePath = path.join(CACHE_DIR, `${day}.json`)
      if (fs.existsSync(cachePath)) {
        console.info(`[quiz] CACHE HIT for day ${day}. No AI needed.`)
        return NextResponse.json(JSON.parse(fs.readFileSync(cachePath, 'utf8')))
      }
    }

    // 2. TIER 2: AI GENERATION (Infinite Router - Otomatis Failover ke model Gratis yang AKTIF)
    console.info(`[quiz] Attempting AI generation with Router for: ${title}...`)
    const prompt = `Buatlah 3 pertanyaan pilihan ganda singkat berdasarkan artikel "${title}" berikut. 
Artikel: ${content.substring(0, 2000)}
HANYA kembalikan JSON mentah dalam format array:
[{"question": "...", "options": ["...", "...", "...", "..."], "answer": 0}]`

    try {
      // STRATEGI: MULTI-RETRY & AUTO-ROUTER (Anti-429)
      let aiResponse = null;
      let lastError = null;
      const modelAttempts = [
        'upstage/solar-pro-3',
        'openrouter/free',
        'arcee-ai/trinity-mini:free'
      ];

      for (let i = 0; i < modelAttempts.length; i++) {
        try {
          console.info(`[quiz] Attempt ${i + 1} with ${modelAttempts[i]}...`);
          const { text } = await generateText({
            model: openrouter(modelAttempts[i]),
            prompt,
            temperature: 0.3,
          });
          aiResponse = text;
          if (aiResponse) break;
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          lastError = error;
          console.error(`[quiz] Attempt ${i + 1} failed:`, error.message);
          if (error.message?.includes('429')) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      if (!aiResponse) throw lastError || new Error('All quiz model attempts failed');
        
      const cleanedText = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim()
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('AI returned no JSON array')
      const quiz = JSON.parse(jsonMatch[0])

      // Simpan ke Cache
      if (day) {
        if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true })
        fs.writeFileSync(path.join(CACHE_DIR, `${day}.json`), JSON.stringify(quiz, null, 2))
      }

      return NextResponse.json(quiz)
    } catch (aiError) {
      const errorMsg = aiError instanceof Error ? aiError.message : String(aiError)
      console.error(`[quiz] AI TIER FAILED:`, errorMsg)
      if (errorMsg.includes('429')) console.warn('[quiz] Rate limit hit! Switching to Local Fallback...')
      throw aiError // Re-throw to hit Tier 3
    }

  } catch (error) {
    // 3. TIER 3: LOCAL FALLBACK (Anti-Zonk / Anti-API-Error)
    const day = requestData?.day || 0
    console.info(`[quiz] TIER 3 FALLBACK triggered for day: ${day}`)
    
    const fallback = LOCAL_FALLBACKS[day] || GENERIC_FALLBACK
    return NextResponse.json(fallback)
  }
}
