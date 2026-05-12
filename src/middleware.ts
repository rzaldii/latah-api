import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(request: NextRequest) {

  const token = request.headers
    .get('authorization')
    ?.split(' ')[1]

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized',
      },
      { status: 401 }
    )
  }

  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid token',
      },
      { status: 401 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/auth/me',
  ],
}