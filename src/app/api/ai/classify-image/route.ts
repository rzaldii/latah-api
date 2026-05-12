import { NextResponse } from 'next/server'

const mockResults = [
  {
    category: 'Jalan Rusak',
    confidence: 0.93,
  },
  {
    category: 'Sampah Menumpuk',
    confidence: 0.89,
  },
  {
    category: 'Lampu Jalan Mati',
    confidence: 0.91,
  },
]

export async function POST() {

  const random =
    mockResults[
      Math.floor(Math.random() * mockResults.length)
    ]

  return NextResponse.json({
    success: true,
    data: random,
  })
}