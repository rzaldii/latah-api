import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function GET() {

  const { data, error } = await supabaseAdmin
    .from('reports')
    .select(`
      category_id,
      report_categories (
        id,
        name
      )
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

    const category = item.report_categories

    if (!category) return

    if (!grouped[category.name]) {
      grouped[category.name] = {
        category: category.name,
        total: 0,
      }
    }

    grouped[category.name].total++
  })

  return NextResponse.json({
    success: true,
    data: Object.values(grouped),
  })
}