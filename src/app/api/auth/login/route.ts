import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../../../lib/auth'

export async function POST(request: Request) {

  const body = await request.json()

  const {
    email,
    password,
  } = body

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid credentials',
      },
      { status: 401 }
    )
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid credentials',
      },
      { status: 401 }
    )
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  return NextResponse.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
}