import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function GET(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams

  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  let query = supabaseAdmin
    .from('reports')
    .select(`
      id,
      title,
      description,
      location_name,
      status,
      priority_score,
      created_at,

      users (
        id,
        name
      ),

      report_categories (
        id,
        name,
        icon
      ),

      report_images (
        id,
        image_url
      )
    `)
    .order('created_at', { ascending: false })
    .is('deleted_at', null)

  if (status) {
    query = query.eq('status', status)
  }

  if (category) {
    query = query.eq('category_id', category)
  }

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    total: data.length,
    data,
  })
}

export async function POST(request: Request) {

  const body = await request.json()

  const {
    user_id,
    category_id,
    title,
    description,
    location_name,
    address_detail,
    latitude,
    longitude,
  } = body

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
        priority_score: Math.floor(Math.random() * 100),
      },
    ])
    .is('deleted_at', null)
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
      message: 'Report created successfully',
      data,
    },
    { status: 201 }
  )
}