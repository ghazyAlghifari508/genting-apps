import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body

    // Verify signature
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
      .digest('hex')

    if (signature_key !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      )
    }

    // Determine payment status
    let paymentStatus = 'pending'
    
    if (transaction_status === 'capture') {
      paymentStatus = fraud_status === 'accept' ? 'success' : 'challenge'
    } else if (transaction_status === 'settlement') {
      paymentStatus = 'success'
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      paymentStatus = 'failed'
    } else if (transaction_status === 'pending') {
      paymentStatus = 'pending'
    }

    // Update payment in database
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('payments')
      .update({ status: paymentStatus })
      .eq('midtrans_order_id', order_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
