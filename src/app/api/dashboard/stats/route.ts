import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function GET() {

  const { count: totalReports } = await supabaseAdmin
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  const { count: pendingReports } = await supabaseAdmin
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .is('deleted_at', null)

  const { count: processingReports } = await supabaseAdmin
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'processing')
    .is('deleted_at', null)

  const { count: resolvedReports } = await supabaseAdmin
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolved')
    .is('deleted_at', null)

  const { count: totalUsers } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({
    success: true,
    data: {
      total_reports: totalReports || 0,
      pending_reports: pendingReports || 0,
      processing_reports: processingReports || 0,
      resolved_reports: resolvedReports || 0,
      total_users: totalUsers || 0,
    },
  })
}