import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('reports')
    .select(`
      id,
      title,
      description,
      status,
      priority_score,
      created_at,
      users:users(id, name, email),
      report_categories:report_categories(id, name),
      report_images(id, image_url)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  const body = await request.json()

  const { user_id, category_id, title, description, location_name, address_detail, latitude, longitude } = body

  const { data, error } = await supabaseAdmin
    .from('reports')
    .insert([
      {
        user_id,
        category_id,
        title,
        description,
        location_name,
        address_detail,
        latitude,
        longitude,
        status: 'pending',
        priority_score: 0,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, data }, { status: 201 })
}