import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../lib/supabase/admin'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { error } =
    await supabaseAdmin
      .from('reports')
      .update({
        deleted_at: new Date(),
      })
      .is('deleted_at', null)
      .eq('id', id)

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
    message: 'Report deleted',
  })
}