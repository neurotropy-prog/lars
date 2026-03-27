/**
 * /api/admin/upload — POST
 *
 * Sube un video a Supabase Storage (bucket 'videos').
 * Acepta MP4, MOV, WebM. Máximo 50MB.
 * Devuelve la URL pública del archivo.
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase'

const MAX_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
const BUCKET = 'videos'

export async function POST(req: NextRequest) {
  // Auth
  const cookieStore = await cookies()
  const { authorized, status } = await verifyAdmin(cookieStore)
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const hash = formData.get('hash') as string | null

  if (!file || !hash) {
    return NextResponse.json({ error: 'Falta archivo o hash' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo no permitido. Acepta MP4, MOV, WebM.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Archivo demasiado grande. Máximo 50MB.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Ensure bucket exists
  const { error: bucketError } = await supabase.storage.getBucket(BUCKET)
  if (bucketError) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (createError) {
      console.error('[upload] Error creating bucket:', createError)
      return NextResponse.json({ error: 'Error creando storage' }, { status: 500 })
    }
  }

  // Upload
  const ext = file.name.split('.').pop() ?? 'mp4'
  const path = `${hash}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('[upload] Error uploading:', uploadError)
    return NextResponse.json({ error: 'Error subiendo archivo' }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)

  return NextResponse.json({ url: urlData.publicUrl })
}
