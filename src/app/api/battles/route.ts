import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let query = supabase.from('historical_battles').select('*')

  if (from && to) {
    query = query.gte('year', from).lte('year', to)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}
