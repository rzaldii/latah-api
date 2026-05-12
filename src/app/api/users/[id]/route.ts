import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabaseAdmin
    .from('users')
    .select(`
      id,
      name,
      email,
      role,
      created_at
    `)
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data,
  })
}