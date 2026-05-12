import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../lib/supabase/admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

  const { data, error } = await supabaseAdmin
    .from('comments')
    .select(`
      id,
      comment,
      created_at,

      users (
        id,
        name
      )
    `)
    .eq('report_id', params.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    total: data.length,
    data,
  })
}