import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const reportId = searchParams.get('report_id')

  if (!reportId) {
    return NextResponse.json(
      { success: false, message: 'report_id wajib diisi' },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('comments')
    .select(`
      id,
      report_id,
      user_id,
      comment,
      created_at,
      updated_at,
      users (
        id,
        name,
        avatar
      )
    `)
    .eq('report_id', reportId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { report_id, user_id, comment } = body

  if (!report_id || !user_id || !comment) {
    return NextResponse.json(
      { success: false, message: 'report_id, user_id, dan comment wajib diisi' },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('comments')
    .insert([{ report_id, user_id, comment }])
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true, data }, { status: 201 })
}