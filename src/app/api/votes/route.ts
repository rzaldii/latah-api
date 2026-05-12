import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function POST(request: Request) {

  const body = await request.json()

  const {
    report_id,
    user_id,
  } = body

  const { data, error } = await supabaseAdmin
    .from('votes')
    .insert([
      {
        report_id,
        user_id,
        vote_type: 'upvote',
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Vote added successfully',
      data,
    },
    { status: 201 }
  )
}