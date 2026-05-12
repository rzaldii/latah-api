import { NextResponse } from 'next/server'
import { classifyReport } from '../../../../lib/ai/classifier'

export async function POST(request: Request) {

  const body = await request.json()

  const text =
    `${body.title} ${body.description}`

  const category =
    classifyReport(text)

  return NextResponse.json({
    success: true,
    data: {
      category,
    },
  })
}