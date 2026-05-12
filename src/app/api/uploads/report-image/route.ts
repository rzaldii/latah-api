import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function POST(request: Request) {

  try {

    const formData = await request.formData()

    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: 'File is required',
        },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()

    const buffer = Buffer.from(bytes)

    const fileName =
      `${Date.now()}-${file.name}`

    const { error } = await supabaseAdmin
      .storage
      .from('report-images')
      .upload(fileName, buffer, {
        contentType: file.type,
      })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      )
    }

    const {
      data: publicUrlData,
    } = supabaseAdmin
      .storage
      .from('report-images')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      data: {
        file_name: fileName,
        image_url:
          publicUrlData.publicUrl,
      },
    })

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    )
  }
}