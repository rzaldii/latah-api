import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../lib/supabase/admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

  const { data, error } = await supabaseAdmin
    .from('votes')
    .select('*')
    .eq('report_id', params.id)

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    total_votes: data.length,
    data,
  })
}