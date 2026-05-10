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
    .from('votes')
    .select('id, report_id, user_id, vote_type, created_at')
    .eq('report_id', reportId)
    .order('created_at', { ascending: false })

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
  const { report_id, user_id, vote_type = 'upvote' } = body

  if (!report_id || !user_id) {
    return NextResponse.json(
      { success: false, message: 'report_id dan user_id wajib diisi' },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('votes')
    .insert([{ report_id, user_id, vote_type }])
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

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const reportId = searchParams.get('report_id')
  const userId = searchParams.get('user_id')

  if (!reportId || !userId) {
    return NextResponse.json(
      { success: false, message: 'report_id dan user_id wajib diisi' },
      { status: 400 }
    )
  }

  const { error } = await supabaseAdmin
    .from('votes')
    .delete()
    .eq('report_id', reportId)
    .eq('user_id', userId)

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, message: 'Vote berhasil dihapus' })
}