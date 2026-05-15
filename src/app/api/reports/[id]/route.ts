import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

  const { data, error } = await supabaseAdmin
    .from('reports')
    .select(`
      *,
      
      users (
        id,
        name,
        email
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
        id,
        comment,
        created_at,
        users (
          id,
          name
        )
      ),

      votes (
        id,
        vote_type
      )
    `)
    .is('deleted_at', null)
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data,
  })
}

function getStatusLabel(status: string) {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    verified: 'Terverifikasi',
    processing: 'Diproses',
    resolved: 'Selesai',
    rejected: 'Ditolak',
  }

  return statusMap[status] || status
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const nextStatus = body.status || body.new_status

    const allowedStatuses = [
      'pending',
      'verified',
      'processing',
      'resolved',
      'rejected',
    ]

    if (!nextStatus || !allowedStatuses.includes(nextStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid report status',
        },
        { status: 400 }
      )
    }

    const { data: existingReport, error: existingReportError } =
      await supabaseAdmin
        .from('reports')
        .select(`
          id,
          title,
          user_id,
          status
        `)
        .eq('id', id)
        .is('deleted_at', null)
        .single()

    if (existingReportError) {
      return NextResponse.json(
        {
          success: false,
          message: existingReportError.message,
        },
        { status: 404 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('reports')
      .update({
        status: nextStatus,
      })
      .eq('id', id)
      .is('deleted_at', null)
      .select(`
        *,
        
        users (
          id,
          name,
          email
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
          id,
          comment,
          created_at,
          users (
            id,
            name
          )
        ),

        votes (
          id,
          vote_type
        )
      `)
      .single()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      )
    }

    if (existingReport.user_id && existingReport.status !== nextStatus) {
      const { error: notificationError } = await supabaseAdmin
      .from('notifications')
      .insert([
        {
          user_id: existingReport.user_id,
          report_id: existingReport.id,
          report_status: nextStatus,
          title: 'Status laporan diperbarui',
          message: `Laporan "${existingReport.title}" berubah status menjadi ${getStatusLabel(nextStatus)}.`,
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ])

      if (notificationError) {
        console.error('CREATE NOTIFICATION ERROR:', notificationError.message)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Report status updated successfully',
      data,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update report status',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { error } = await supabaseAdmin
    .from('reports')
    .delete()
    .is('deleted_at', null)
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Report deleted successfully',
  })
}