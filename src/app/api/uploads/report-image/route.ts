import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export const runtime = 'nodejs'

const BUCKET_NAME = 'report-images'

async function ensureBucketExists() {
  const { data: buckets, error: listError } = await supabaseAdmin
    .storage
    .listBuckets()

  if (listError) {
    throw new Error(listError.message)
  }

  const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME)

  if (!bucketExists) {
    const { error: createError } = await supabaseAdmin
      .storage
      .createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
        ],
        fileSizeLimit: 3 * 1024 * 1024,
      })

    if (createError) {
      throw new Error(createError.message)
    }
  }
}

export async function POST(request: Request) {
  try {
    await ensureBucketExists()

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

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        {
          success: false,
          message: 'File must be an image',
        },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()

    const buffer = Buffer.from(bytes)

    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabaseAdmin
      .storage
      .from(BUCKET_NAME)
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
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      data: {
        file_name: fileName,
        image_url: publicUrlData.publicUrl,
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