// Midtrans Snap API - Direct HTTP call (no npm package needed, avoids ESM/CJS issues)
// Docs: https://docs.midtrans.com/reference/backend-integration

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || ''
const MIDTRANS_API_URL = process.env.MIDTRANS_API_URL || 'https://app.sandbox.midtrans.com/snap/v1/transactions'

interface TransactionParams {
  orderId: string
  grossAmount: number
  customerName: string
  customerEmail: string
  itemName: string
}

export async function createSnapToken(params: TransactionParams): Promise<string> {
  if (!MIDTRANS_SERVER_KEY) {
    throw new Error('MIDTRANS_SERVER_KEY is not configured')
  }

  const authString = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')

  const body = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
    },
    item_details: [
      {
        id: params.orderId,
        price: params.grossAmount,
        quantity: 1,
        name: params.itemName,
      },
    ],
  }

  const response = await fetch(MIDTRANS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${authString}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Midtrans API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.token
}
