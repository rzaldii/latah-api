import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function GET(request: Request) {

  const { searchParams } =
    new URL(request.url)

  const userId =
    searchParams.get('user_id')

  const { data, error } =
    await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', {
        ascending: false,
      })

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    data,
  })
}