import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../lib/supabase/admin'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {

  const body = await request.json()

  const {
    new_status,
    changed_by,
    notes,
  } = body

  const { data: report } = await supabaseAdmin
    .from('reports')
    .select('*')
    .is('deleted_at', null)
    .eq('id', params.id)
    .single()

  if (!report) {
    return NextResponse.json(
      {
        success: false,
        message: 'Report not found',
      },
      { status: 404 }
    )
  }

  await supabaseAdmin
    .from('reports')
    .update({
        status: new_status,
    })
    .is('deleted_at', null)
    .eq('id', params.id)

  await supabaseAdmin
    .from('report_status_histories')
    .insert([
      {
        report_id: params.id,
        old_status: report.status,
        new_status,
        changed_by,
        notes,
      },
    ])

  return NextResponse.json({
    success: true,
    message: 'Status updated',
  })
}