import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

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
    .eq('id', params.id)
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {

  const { error } = await supabaseAdmin
    .from('reports')
    .delete()
    .is('deleted_at', null)
    .eq('id', params.id)

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