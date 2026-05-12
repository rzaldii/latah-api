import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

const allowedStatuses = ['pending', 'verified', 'processing', 'resolved', 'rejected']

export async function PATCH(request: Request) {
  const body = await request.json()
  const { report_id, new_status, changed_by_user_id, note = null } = body

  if (!report_id || !new_status) {
    return NextResponse.json(
      { success: false, message: 'report_id dan new_status wajib diisi' },
      { status: 400 }
    )
  }

  if (!allowedStatuses.includes(new_status)) {
    return NextResponse.json(
      { success: false, message: 'new_status tidak valid' },
      { status: 400 }
    )
  }

  const { data: currentReport, error: currentError } = await supabaseAdmin
    .from('reports')
    .select('id, status')
    .eq('id', report_id)
    .is('deleted_at', null)
    .single()

  if (currentError) {
    return NextResponse.json(
      { success: false, message: currentError.message },
      { status: 404 }
    )
  }

  const oldStatus = currentReport.status

  const { data: updatedReport, error: updateError } = await supabaseAdmin
    .from('reports')
    .update({
      status: new_status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', report_id)
    .is('deleted_at', null)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json(
      { success: false, message: updateError.message },
      { status: 500 }
    )
  }

  const { error: historyError } = await supabaseAdmin
    .from('report_status_histories')
    .insert([
      {
        report_id,
        changed_by_user_id,
        old_status: oldStatus,
        new_status,
        note,
      },
    ])

  if (historyError) {
    return NextResponse.json(
      { success: false, message: historyError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    data: updatedReport,
    message: 'Status laporan berhasil diperbarui',
  })
}