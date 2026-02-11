import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export type PaymentMethod = 'credit_card' | 'e_wallet' | 'bank_transfer'

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'credit_card', label: 'Kartu Kredit / Debit', icon: '💳' },
  { value: 'e_wallet', label: 'E-Wallet (OVO, Dana, GoPay)', icon: '📱' },
  { value: 'bank_transfer', label: 'Transfer Bank', icon: '🏦' },
]

export async function confirmDummyPayment(consultationId: string, method: PaymentMethod) {
  const ref = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  const { error } = await supabase
    .from('consultations')
    .update({
      payment_status: 'confirmed',
      payment_method: method,
      payment_reference: ref,
      payment_date: new Date().toISOString(),
      status: 'scheduled',
    })
    .eq('id', consultationId)

  if (error) throw error
  return ref
}
