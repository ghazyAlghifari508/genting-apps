import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_INSTRUCTION = `Anda adalah Genting AI, asisten virtual Genting: Generasi Anti-Stunting.

SPESIALISASI: Kesehatan ibu hamil, nutrisi anak, pencegahan stunting, MPASI, ASI, imunisasi, tumbuh kembang anak 0-5 tahun.

FORMAT JAWABAN (WAJIB IKUTI):
- Sapaan singkat: "Halo Bunda! 😊"
- Jawab LANGSUNG ke inti pertanyaan, jangan bertele-tele
- Maksimal 3-5 poin bullet per bagian, gunakan **bold** untuk penekanan
- JANGAN buat tabel panjang atau daftar yang berlebihan
- Panjang jawaban: cukup untuk menjawab pertanyaan, tidak lebih
- Akhiri dengan 1 kalimat tawaran bantuan lanjut jika perlu

GAYA BAHASA: Ramah, santai tapi informatif, pakai "Bunda", berbasis WHO/Kemenkes RI/IDAI.
BATASAN: Tolak topik di luar kesehatan ibu & anak. Jangan diagnosis medis spesifik.`

interface HistoryMessage {
  role?: string
  content?: string
}

export async function POST(req: NextRequest) {
  const { history, message } = await req.json()

  const messages = [
    { role: 'system', content: SYSTEM_INSTRUCTION },
    ...(history ?? []).map((m: HistoryMessage) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content || '',
    })),
    { role: 'user', content: message },
  ]

  // Stream directly from OpenRouter to the client
  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://genting-app.vercel.app',
      'X-Title': 'Genting App',
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages,
      stream: true, // <-- enable streaming
    }),
  })

  if (!upstream.ok) {
    const err = await upstream.text()
    console.error('OpenRouter error:', err)
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }

  // Forward the SSE stream directly to the browser
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}
