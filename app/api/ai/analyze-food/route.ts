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

    let aiResponse = null;
    let lastError = null;
    const modelAttempts = [
      'openrouter/free',
      'nvidia/nemotron-nano-12b-v2-vl:free',
      'google/gemma-3-12b-it:free'
    ];

    for (let i = 0; i < modelAttempts.length; i++) {
      try {
        const modelId = modelAttempts[i];
        console.info(`[analyze-food] [Attempt ${i+1}/${modelAttempts.length}] Using: ${modelId}`);
        
        const result = (await Promise.race([
          generateText({
            model: openrouter(modelId),
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  { type: 'image', image: `data:${mimeType};base64,${base64}` },
                ],
              },
            ],
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Model timeout (30s)')), 30000))
        ])) as { text: string };

        if (!result || !result.text || result.text.trim().length === 0) {
          console.warn(`[analyze-food] Model ${modelId} returned empty response.`);
          continue;
        }

        aiResponse = result.text;
        console.info(`[analyze-food] Model ${modelId} success! Length: ${aiResponse.length}`);
        break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.error(`[analyze-food] Attempt ${i+1} (${modelAttempts[i]}) failed:`, lastError.message);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    if (!aiResponse) {
      console.error('[analyze-food] All models exhausted. Last error:', lastError?.message);
      throw lastError || new Error('Antrean server sedang penuh. Silakan coba lagi ya, Bun! 🙏');
    }

    const rawJson = extractJSON(aiResponse);
    if (!rawJson) {
      console.error('[analyze-food] Failed to find JSON in response:', aiResponse.substring(0, 100) + '...');
      throw new Error('Gagal mengekstraksi data nutrisi. Silakan coba lagi sebentar lagi.');
    }

    const analysis = FoodAnalysisSchema.parse({
      foodName: rawJson.foodName || "Makanan Terdeteksi",
      calories: Number(rawJson.calories) || 0,
      protein: Number(rawJson.protein) || 0,
      carbs: Number(rawJson.carbs) || 0,
      fat: Number(rawJson.fat) || 0,
      iron: Number(rawJson.iron) || 0,
      zinc: Number(rawJson.zinc) || 0,
      calcium: Number(rawJson.calcium) || 0,
      folicAcid: Number(rawJson.folicAcid) || 0,
      vitaminA: Number(rawJson.vitaminA) || 0,
      stuntingNutritionScore: Number(rawJson.stuntingNutritionScore) || 50,
      tip: typeof rawJson.tip === 'string' ? rawJson.tip : "Bunda tetap semangat jaga asupan gizi si Kecil ya!",
      isHealthy: rawJson.isHealthy === undefined ? true : Boolean(rawJson.isHealthy)
    });

    return new Response(
      JSON.stringify({ success: true, analysis, isFallback: false }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[analyze-food] AI Failure, using safety stub:', errorMsg);
    
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
      JSON.stringify({ success: false, analysis: safetyAnalysis, isFallback: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
