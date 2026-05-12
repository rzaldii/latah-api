import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from('reports')
    .select(`
      id,
      title,
      status,
      priority_score,
      created_at,

      users (
        id,
        name
      ),

      report_categories (
        id,
        name,
        icon
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(5)

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