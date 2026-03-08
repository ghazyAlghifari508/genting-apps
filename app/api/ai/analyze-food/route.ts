import { openrouter } from '@/lib/openrouter'
import { generateText } from 'ai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FoodAnalysisSchema = z.object({
  foodName: z.string().describe('Nama makanan yang terdeteksi dalam bahasa Indonesia'),
  calories: z.number().describe('Perkiraan kalori dalam kcal'),
  protein: z.number().describe('Perkiraan protein dalam gram'),
  carbs: z.number().describe('Perkiraan karbohidrat dalam gram'),
  fat: z.number().describe('Perkiraan lemak dalam gram'),
  iron: z.number().describe('Perkiraan zat besi dalam mg'),
  zinc: z.number().describe('Perkiraan zinc dalam mg'),
  calcium: z.number().describe('Perkiraan kalsium dalam mg'),
  folicAcid: z.number().describe('Perkiraan asam folat dalam mcg'),
  vitaminA: z.number().describe('Perkiraan vitamin A dalam mcg'),
  stuntingNutritionScore: z.number().min(0).max(100).describe('Skor nutrisi anti-stunting 0-100, berdasarkan kandungan protein, zat besi, zinc, dan nutrisi penting lainnya'),
  tip: z.string().describe('Tips singkat dalam bahasa Indonesia tentang makanan ini untuk pencegahan stunting, maksimal 2 kalimat'),
  isHealthy: z.boolean().describe('Apakah makanan ini baik untuk ibu hamil'),
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    const userId = formData.get('userId') as string

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Gambar diperlukan' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = image.type || 'image/jpeg'

    const prompt = `Kamu adalah ahli gizi Indonesia. Analisis foto makanan ini untuk ibu hamil yang ingin mencegah stunting.

PENTING: Semua jawaban WAJIB dalam BAHASA INDONESIA. Nama makanan HARUS dalam bahasa Indonesia (contoh: "Bubur Ayam", "Nasi Goreng", "Soto Betawi", bukan nama Inggris).

Keluarkan HASIL HANYA DALAM FORMAT JSON yang valid tanpa markdown formatting (jangan pakai \`\`\`json).
Struktur JSON harus persis seperti ini:
{
  "foodName": "Nama makanan dalam Bahasa Indonesia (string)",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "iron": 0,
  "zinc": 0,
  "calcium": 0,
  "folicAcid": 0,
  "vitaminA": 0,
  "stuntingNutritionScore": 0,
  "tip": "Tips singkat dalam Bahasa Indonesia (string)",
  "isHealthy": true
}

Berikan estimasi nutrisi yang akurat berdasarkan porsi standar makanan Indonesia.
Jika bukan gambar makanan, berikan foodName: "Bukan Makanan", nilai 0, dan isHealthy: false.`

    const { text: jsonString } = await generateText({
      model: openrouter('nvidia/nemotron-nano-12b-v2-vl:free'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image',
              image: new URL(`data:${mimeType};base64,${base64}`),
            },
          ],
        },
      ],
    })

    // Parse JSON manually
    let analysis: z.infer<typeof FoodAnalysisSchema>;
    try {
      // Clean potential markdown code blocks
      const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      analysis = FoodAnalysisSchema.parse(JSON.parse(cleanJson));
    } catch {
      console.error('[analyze-food] Failed to parse AI response');
      throw new Error('Gagal memproses hasil analisis AI');
    }

    // Save to database if user is logged in
    let scanId: string | null = null
    if (userId) {
      try {
        const { data, error } = await supabaseAdmin
          .from('food_scans')
          .insert({
            user_id: userId,
            food_name: analysis.foodName,
            calories: analysis.calories,
            protein: analysis.protein,
            carbs: analysis.carbs,
            fat: analysis.fat,
            iron: analysis.iron,
            zinc: analysis.zinc,
            calcium: analysis.calcium,
            folic_acid: analysis.folicAcid,
            vitamin_a: analysis.vitaminA,
            stunting_nutrition_score: analysis.stuntingNutritionScore,
            tip: analysis.tip,
            is_healthy: analysis.isHealthy,
          })
          .select('id')
          .single()

        if (!error && data) {
          scanId = data.id
        }
      } catch (dbErr) {
        console.error('[analyze-food] DB save error:', dbErr)
      }
    }

    return new Response(
      JSON.stringify({ success: true, analysis, scanId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[analyze-food] Error:', errorMessage);
    
    return new Response(
      JSON.stringify({ 
        error: `Gagal menganalisis gambar Bunda. Silakan coba lagi nanti ya. 🙏`,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
