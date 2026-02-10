import { google } from '@/lib/google-ai'
import { generateText } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

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

    // Customize prompt to request JSON explicitly
    const prompt = `Analisis foto makanan ini untuk ibu hamil yang ingin mencegah stunting pada bayinya.
    
    Keluarkan HASIL HANYA DALAM FORMAT JSON yang valid tanpa markdown formatting (seperti \`\`\`json).
    Struktur JSON harus persis seperti ini:
    {
      "foodName": "Nama makanan (string)",
      "calories": 0 (number),
      "protein": 0 (number),
      "carbs": 0 (number),
      "fat": 0 (number),
      "iron": 0 (number),
      "zinc": 0 (number),
      "calcium": 0 (number),
      "folicAcid": 0 (number),
      "vitaminA": 0 (number),
      "stuntingNutritionScore": 0 (number 0-100),
      "tip": "Tips singkat (string)",
      "isHealthy": boolean
    }
    
    Berikan estimasi nutrisi yang akurat. Jika bukan gambar makanan, berikan nilai 0 dan isHealthy: false.`

    // Analyze with Gemini Vision using generateText (v1 compatible)
    const { text: jsonString } = await generateText({
      model: google('gemini-1.5-flash'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: `data:${mimeType};base64,${base64}`,
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    })

    // Parse JSON manually
    let analysis;
    try {
      // Clean potential markdown code blocks
      const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      analysis = JSON.parse(cleanJson);
    } catch (e) {
      console.error('Failed to parse JSON:', jsonString);
      throw new Error('Gagal memproses hasil analisis AI');
    }

    // Save to database if userId provided
    if (userId) {
      const supabase = await createClient()
      
      // Upload image to Supabase Storage
      const fileName = `${userId}/${Date.now()}.${image.type.split('/')[1] || 'jpg'}`
      const { data: uploadData } = await supabase.storage
        .from('food-images')
        .upload(fileName, image)

      let imageUrl = null
      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('food-images')
          .getPublicUrl(fileName)
        imageUrl = publicUrl
      }

      // Save to food_logs
      await supabase.from('food_logs').insert({
        user_id: userId,
        image_url: imageUrl,
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
        ai_tip: analysis.tip,
        stunting_nutrition_score: analysis.stuntingNutritionScore,
      })
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Analyze Food API Error Detailed:', error)
    if (error instanceof Error) {
      console.error('Error Message:', error.message)
      console.error('Error Stack:', error.stack)
    }
    return new Response(
      JSON.stringify({ 
        error: `Error: ${error instanceof Error ? error.message : String(error)}`,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
