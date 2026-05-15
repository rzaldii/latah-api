import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

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
      .from('notifications')
      .select(`
        id,
        user_id,
        report_id,
        report_status,
        title,
        message,
        is_read,
        created_at
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
        message: error.message || 'Failed to get notifications',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const userId = body.user_id

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'user_id is required',
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
        },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({
        is_read: true,
      })
      .eq('user_id', numericUserId)
      .eq('is_read', false)
      .select(`
        id,
        user_id,
        report_id,
        report_status,
        title,
        message,
        is_read,
        created_at
      `)

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
      message: 'Notifications marked as read',
      data: data ?? [],
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update notifications',
      },
      { status: 500 }
    )
  }
}