import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { content } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getCurrentProfile } from '@/lib/auth'
import VideoPlayer from '@/components/player/video-player'

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [item, profile] = await Promise.all([
    db.select().from(content).where(eq(content.id, id)).limit(1).then((r) => r[0]),
    getCurrentProfile(),
  ])

  if (!item || !profile) notFound()

  return (
    <div className="fixed inset-0 bg-black z-50">
      <VideoPlayer contentId={item.id} videoId={item.videoId} title={item.title} />
    </div>
  )
}
