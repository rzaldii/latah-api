import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {

  const body = await request.json()

  const {
    name,
    email,
    password,
  } = body

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (existingUser) {
    return NextResponse.json(
      {
        success: false,
        message: 'Email already registered',
      },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([
      {
        name,
        email,
        password: hashedPassword,
        role: 'citizen',
      },
    ])
    .select()
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

  return NextResponse.json(
    {
      success: true,
      message: 'Register success',
      data,
    },
    { status: 201 }
  )
}