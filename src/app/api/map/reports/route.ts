import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from('reports')
    .select(`
      id,
      title,
      description,
      latitude,
      longitude,
      location_name,
      status,
      priority_score,

      report_categories (
        id,
        name,
        icon
      )
    `)
    .is('deleted_at', null)

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