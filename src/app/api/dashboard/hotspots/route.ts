import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from('reports')
    .select(`
      id,
      location_name,
      status,
      priority_score
    `)
    .is('deleted_at', null)

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    )
  }

  const grouped: Record<string, any> = {}

  data.forEach((item: any) => {

    const location = item.location_name

    if (!grouped[location]) {
      grouped[location] = {
        location_name: location,
        total_reports: 0,
        avg_priority: 0,
      }
    }

    grouped[location].total_reports++
    grouped[location].avg_priority += item.priority_score || 0
  })

  const hotspots = Object.values(grouped).map((item: any) => ({
    ...item,
    avg_priority:
      item.avg_priority / item.total_reports,
  }))

  hotspots.sort(
    (a: any, b: any) =>
      b.total_reports - a.total_reports
  )

  return NextResponse.json({
    success: true,
    data: hotspots,
  })
}