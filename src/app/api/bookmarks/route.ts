import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function POST(request: Request) {

  const body = await request.json()

  const {
    user_id,
    report_id,
  } = body

  const { data, error } =
    await supabaseAdmin
      .from('bookmarks')
      .insert([
        {
          user_id,
          report_id,
        },
      ])
      .select()
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
    data,
  })
}

export async function GET(request: Request) {

  const { searchParams } =
    new URL(request.url)

  const userId =
    searchParams.get('user_id')

  const { data, error } =
    await supabaseAdmin
      .from('bookmarks')
      .select(`
        id,

        reports (
          id,
          title,
          status,
          priority_score
        )
      `)
      .eq('user_id', userId)

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