import { createSupabaseServerClient } from '@/utils/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { userId, xp, reason } = await req.json()

  await supabase.rpc('add_xp', {
    p_user: userId,
    p_xp: xp,
    p_reason: reason
  })

  return NextResponse.json({ success: true })
}
