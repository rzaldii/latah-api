import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function GET(request: Request) {

  const { searchParams } =
    new URL(request.url)

  const userId =
    searchParams.get('user_id')

  const { count: totalReports } =
    await supabaseAdmin
      .from('reports')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('user_id', userId)
      .is('deleted_at', null)

  const { count: totalComments } =
    await supabaseAdmin
      .from('comments')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('user_id', userId)

  const { count: totalVotes } =
    await supabaseAdmin
      .from('votes')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('user_id', userId)

  return NextResponse.json({
    success: true,
    data: {
      total_reports:
        totalReports || 0,

      total_comments:
        totalComments || 0,

      total_votes:
        totalVotes || 0,
    },
  })
}