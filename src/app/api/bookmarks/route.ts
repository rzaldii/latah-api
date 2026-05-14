import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      user_id,
      report_id,
    } = body

    if (!user_id || !report_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'user_id and report_id are required',
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('bookmarks')
      .insert([
        {
          user_id: Number(user_id),
          report_id: Number(report_id),
        },
      ])
      .select(`
        id,
        user_id,
        report_id,
        created_at,

        reports (
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
          ),

          comments (
            id
          ),

          votes (
            id,
            vote_type
          )
        )
      `)
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
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create bookmark',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'user_id is required',
          data: [],
        },
        { status: 400 }
      )
    }

    const numericUserId = Number(userId)

    if (!Number.isFinite(numericUserId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'user_id must be a valid number',
          data: [],
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('bookmarks')
      .select(`
        id,
        user_id,
        report_id,
        created_at,

        reports (
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
          ),

          comments (
            id
          ),

          votes (
            id,
            vote_type
          )
        )
      `)
      .eq('user_id', numericUserId)
      .order('created_at', { ascending: false })

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
      data: data ?? [],
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to get bookmarks',
      },
      { status: 500 }
    )
  }
}