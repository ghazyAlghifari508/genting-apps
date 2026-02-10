import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!
const MIDTRANS_API_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions'

export async function POST(req: Request) {
  try {
    const { doctorId, userId, amount } = await req.json()

    if (!doctorId || !userId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get user and doctor info
    const { data: user } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single()

    const { data: doctor } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', doctorId)
      .single()

    // Generate order ID
    const orderId = `GENTING-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        doctor_id: doctorId,
        amount,
        status: 'pending',
        midtrans_order_id: orderId,
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    // Call Midtrans API
    const auth = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')
    
    const midtransResponse = await fetch(MIDTRANS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: amount,
        },
        customer_details: {
          first_name: user?.full_name || 'User',
        },
        item_details: [
          {
            id: 'CONSULTATION',
            price: amount,
            quantity: 1,
            name: `Konsultasi dengan ${doctor?.full_name || 'Dokter'}`,
          },
        ],
        callbacks: {
          finish: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/consult/${payment.id}`,
        },
      }),
    })

    const snapData = await midtransResponse.json()

    if (!midtransResponse.ok) {
      throw new Error(snapData.error_messages?.[0] || 'Midtrans error')
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      snapToken: snapData.token,
      redirectUrl: snapData.redirect_url,
    })
  } catch (error) {
    console.error('Payment Create Error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat pembayaran' },
      { status: 500 }
    )
  }
}
