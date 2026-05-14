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
      address_detail,
      latitude,
      longitude,
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
      ),

      comments (
        id
      ),

      votes (
        id,
        vote_type
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
    total: data?.length ?? 0,
    data,
  })
}

export async function POST(request: Request) {
  try {
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
      image_url,
    } = body

    if (!user_id || !category_id || !title || !description || !location_name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Required report data is incomplete',
        },
        { status: 400 }
      )
    }

    const { data: report, error } = await supabaseAdmin
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
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }

    if (image_url) {
      const { error: imageError } = await supabaseAdmin
        .from('report_images')
        .insert([
          {
            report_id: report.id,
            image_url,
          },
        ])

      if (imageError) {
        return NextResponse.json(
          {
            success: false,
            message: `Report created, but image failed to save: ${imageError.message}`,
            data: report,
          },
          { status: 500 }
        )
      }
    }

    const { data: fullReport, error: fullReportError } = await supabaseAdmin
      .from('reports')
      .select(`
        id,
        title,
        description,
        location_name,
        address_detail,
        latitude,
        longitude,
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
        ),

        comments (
          id
        ),

        votes (
          id,
          vote_type
        )
      `)
      .eq('id', report.id)
      .single()

    if (fullReportError) {
      return NextResponse.json(
        {
          success: true,
          message: 'Report created successfully',
          data: report,
        },
        { status: 201 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Report created successfully',
        data: fullReport,
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create report',
      },
      { status: 500 }
    )
  }
}