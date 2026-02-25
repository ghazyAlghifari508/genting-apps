import { Client } from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import dns from 'dns'

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first')
}

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const variations = [
  { name: 'DATABASE_URL', url: process.env.DATABASE_URL },
  { name: 'SUPABASE_POOLER_URL', url: process.env.SUPABASE_POOLER_URL },
  { name: 'SUPABASE_DIRECT_URL', url: process.env.SUPABASE_DIRECT_URL },
].filter((entry) => typeof entry.url === 'string' && entry.url.length > 0)

async function testConnection(name: string, connectionString: string) {
  console.log(`\nTesting: ${name}`)
  console.log(`URL: ${connectionString.replace(/:([^:@]+)@/, ':****@')}`)

  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000,
  })

  try {
    await client.connect()
    const res = await client.query('SELECT NOW() as now')
    console.log(`Connected successfully. Time: ${res.rows[0].now}`)
    await client.end()
    return true
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown connection error'
    const code = typeof err === 'object' && err !== null && 'code' in err ? (err as { code?: string }).code : undefined
    console.error(`Failed: ${message}`)
    if (code) console.error(`Code: ${code}`)
    return false
  }
}

async function run() {
  if (variations.length === 0) {
    console.error('No database URL found. Set DATABASE_URL, SUPABASE_POOLER_URL, or SUPABASE_DIRECT_URL in .env.local')
    process.exit(1)
  }

  for (const variation of variations) {
    const success = await testConnection(variation.name, variation.url!)
    if (success) {
      console.log(`\nRecommended configuration: ${variation.name}`)
      break
    }
  }
}

run()
