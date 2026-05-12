import { NextResponse } from 'next/server'
import { calculatePriorityScore } from '../../../../lib/ai/priority'

export async function POST(request: Request) {

  const body = await request.json()

  const score =
    calculatePriorityScore(body)

  let level = 'low'

  if (score >= 70) {
    level = 'high'
  } else if (score >= 40) {
    level = 'medium'
  }

  return NextResponse.json({
    success: true,
    data: {
      priority_score: score,
      priority_level: level,
    },
  })
}