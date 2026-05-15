import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const user_id = Number(body.user_id)
    const report_id = Number(body.report_id)
    const vote_type = body.vote_type || 'upvote'

    if (!Number.isFinite(user_id) || !Number.isFinite(report_id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'user_id and report_id are required',
        },
        { status: 400 }
      )
    }

    const { data: existingVote, error: existingVoteError } =
      await supabaseAdmin
        .from('votes')
        .select('id, user_id, report_id, vote_type, created_at')
        .eq('user_id', user_id)
        .eq('report_id', report_id)
        .maybeSingle()

    if (existingVoteError) {
      return NextResponse.json(
        {
          success: false,
          message: existingVoteError.message,
        },
        { status: 500 }
      )
    }

    if (existingVote) {
      return NextResponse.json({
        success: true,
        message: 'User already voted this report',
        already_voted: true,
        data: existingVote,
      })
    }

    const { data, error } = await supabaseAdmin
      .from('votes')
      .insert([
        {
          user_id,
          report_id,
          vote_type,
        },
      ])
      .select('id, user_id, report_id, vote_type, created_at')
      .single()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Vote created successfully',
      data,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to vote report',
      },
      { status: 500 }
    )
  }
}