import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('report_categories')
    .select('*')
    .order('name', { ascending: true })

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
  const { name, slug, icon } = body

  if (!name || !slug) {
    return NextResponse.json(
      { success: false, message: 'name dan slug wajib diisi' },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('report_categories')
    .insert([{ name, slug, icon }])
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