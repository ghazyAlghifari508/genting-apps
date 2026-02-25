import { NextRequest, NextResponse } from 'next/server'
import { createSnapToken } from '@/services/midtransService'
import { createClient } from '@/lib/supabase-server'
import { getCurrentUser } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as { consultation_id?: string }
    const consultation_id = body.consultation_id

    if (!consultation_id || typeof consultation_id !== 'string') {
      return NextResponse.json({ error: 'consultation_id is required' }, { status: 400 })
    }

    // Fetch consultation details from Supabase
    const supabase = await createClient()
    const { data: consultation, error } = await supabase
      .from('consultations')
      .select(`
        *,
        doctor:doctors(full_name, specialization),
        user:profiles(full_name, email)
      `)
      .eq('id', consultation_id)
      .eq('user_id', currentUser.id)
      .single()

    if (error || !consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
    }

    if (consultation.payment_status === 'confirmed') {
      return NextResponse.json({ error: 'Payment already confirmed' }, { status: 409 })
    }

    // Midtrans order_id limit is 50 characters. 
    // UUID (36) + "GEN-" (4) + timestamp (13) = 53 chars (Too long).
    // Let's use a shorter prefix and only a part of the UUID or just the timestamp.
    const shortId = consultation_id.split('-')[0] // Take first part of UUID
    const orderId = `GEN-${shortId}-${Date.now()}`
    
    const grossAmount = Math.round(consultation.total_cost || 0)

    if (grossAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Midtrans item name limit is 50 characters.
    const doctor = consultation.doctor as { full_name?: string; specialization?: string } | null
    const user = consultation.user as { full_name?: string; email?: string } | null
    const doctorName = doctor?.full_name || 'Dokter'
    const itemName = `Konsultasi ${doctorName}`.substring(0, 50)

    const token = await createSnapToken({
      orderId,
      grossAmount,
      customerName: user?.full_name || 'User',
      customerEmail: user?.email || 'user@genting.id',
      itemName,
    })

    // Store the order_id in consultation for tracking
    await supabase
      .from('consultations')
      .update({ payment_reference: orderId, updated_at: new Date().toISOString() })
      .eq('id', consultation_id)

    return NextResponse.json({ token, order_id: orderId })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create payment token'
    console.error('Midtrans token error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
