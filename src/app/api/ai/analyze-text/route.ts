import { NextResponse } from 'next/server'
import { classifyReport } from '../../../../lib/ai/classifier'
import { extractKeywords } from '../../../../lib/ai/keywords'

export async function POST(request: Request) {

  const body = await request.json()

  const text =
    `${body.title} ${body.description}`

  const category = classifyReport(text)

  const keywords = extractKeywords(text)

  const urgency =
    text.toLowerCase().includes('parah') ||
    text.toLowerCase().includes('bahaya') ||
    text.toLowerCase().includes('darurat')

  return NextResponse.json({
    success: true,
    data: {
      category,
      keywords,
      urgency_level:
        urgency ? 'high' : 'normal',
    },
  })
}