import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getSignedToken, getHlsUrl } from '@/lib/cloudflare-stream'

export async function GET(_req: Request, { params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = await getSignedToken(videoId)
  const url = getHlsUrl(videoId, token)
  return NextResponse.json({ url })
}
