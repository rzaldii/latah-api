import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function GET() {

  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select(`
      id,
      name,

      reports (
        id
      ),

      comments (
        id
      ),

      votes (
        id
      )
    `)

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    )
  }

  const leaderboard = users.map((user: any) => {

    const reportPoints =
      (user.reports?.length || 0) * 10

    const commentPoints =
      (user.comments?.length || 0) * 3

    const votePoints =
      (user.votes?.length || 0) * 1

    const totalPoints =
      reportPoints +
      commentPoints +
      votePoints

    return {
      id: user.id,
      name: user.name,
      total_points: totalPoints,
      reports_count: user.reports?.length || 0,
      comments_count: user.comments?.length || 0,
      votes_count: user.votes?.length || 0,
    }
  })

  leaderboard.sort(
    (a: any, b: any) =>
      b.total_points - a.total_points
  )

  return NextResponse.json({
    success: true,
    data: leaderboard,
  })
}