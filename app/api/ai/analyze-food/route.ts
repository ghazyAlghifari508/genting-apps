import { openrouter } from '@/lib/openrouter'
import { generateText } from 'ai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60 

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FoodAnalysisSchema = z.object({
  foodName: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  iron: z.number(),
  zinc: z.number(),
  calcium: z.number(),
  folicAcid: z.number(),
  vitaminA: z.number(),
  stuntingNutritionScore: z.number().min(0).max(100),
  tip: z.string(),
  isHealthy: z.boolean(),
})

type FoodAnalysis = z.infer<typeof FoodAnalysisSchema>

// Helper to extract JSON from AI response
function extractJSON(text: string): Record<string, unknown> | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  } catch (error) {
    console.error('[analyze-food] JSON Parse Error:', error);
    return null;
  }
}

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

    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = image.type || 'image/jpeg'

    const prompt = `Analisis foto makanan ini untuk ibu hamil (pencegahan stunting). 
Sangat Penting: Kembalikan respon HANYA dalam format JSON mentah tanpa teks tambahan.
JSON harus memiliki struktur:
{
  "foodName": "Nama Makanan (Bahasa Indonesia)",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "iron": 0,
  "zinc": 0,
  "calcium": 0,
  "folicAcid": 0,
  "vitaminA": 0,
  "stuntingNutritionScore": 0-100,
  "tip": "Tips singkat max 2 kalimat",
  "isHealthy": true/false
}
Jika bukan makanan, isi foodName: "Bukan Makanan" dan isHealthy: false.`

    // STRATEGI: MULTI-RETRY & AUTO-ROUTER (Anti-429)
    let aiResponse = null;
    let lastError = null;
    const modelAttempts = [
      'openrouter/free',
      'nvidia/nemotron-nano-12b-v2-vl:free',
      'google/gemma-3-12b-it:free'
    ];

    for (let i = 0; i < modelAttempts.length; i++) {
      try {
        console.info(`[analyze-food] Attempt ${i + 1} with ${modelAttempts[i]}...`);
        const { text } = await generateText({
          model: openrouter(modelAttempts[i]),
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image', image: `data:${mimeType};base64,${base64}` },
              ],
            },
          ],
        });
        aiResponse = text;
        if (aiResponse) break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.error(`[analyze-food] Attempt ${i + 1} failed:`, lastError.message);
        // Jika 429, tunggu sebentar sebelum lanjut ke model berikutnya
        if (lastError.message?.includes('429')) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    if (!aiResponse) throw lastError || new Error('All model attempts failed');

    const rawJson = extractJSON(aiResponse);
    if (!rawJson) throw new Error('Model returned no valid JSON');
    const analysis = FoodAnalysisSchema.parse(rawJson);

    // Save to database
    let scanId: string | null = null
    if (userId && analysis) {
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

        if (!error && data) scanId = data.id
      } catch (dbErr) {
        console.error('[analyze-food] DB save error:', dbErr)
      }
    }

    return new Response(
      JSON.stringify({ success: true, analysis, scanId, isFallback: false }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[analyze-food] AI Failure, using safety stub:', errorMsg);
    
    // Safety Stub biar gak CRASH/500
    const safetyAnalysis = {
      foodName: "AI Sedang Sibuk 🙏",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      iron: 0,
      zinc: 0,
      calcium: 0,
      folicAcid: 0,
      vitaminA: 0,
      stuntingNutritionScore: 0,
      tip: "Maaf Bun, server AI sedang penuh antrean. Silakan coba lagi sebentar lagi ya! Bunda tetap bisa makan sehat demi si kecil. ❤️",
      isHealthy: true
    }

    return new Response(
      JSON.stringify({ success: true, analysis: safetyAnalysis, isFallback: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
