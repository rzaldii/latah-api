import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function POST(request: Request) {

  const body = await request.json()

  const {
    report_id,
    user_id,
    comment,
  } = body

  const { data, error } = await supabaseAdmin
    .from('comments')
    .insert([
      {
        report_id,
        user_id,
        comment,
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
      message: 'Comment added successfully',
      data,
    },
    { status: 201 }
  )
}