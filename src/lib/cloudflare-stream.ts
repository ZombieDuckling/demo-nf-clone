const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const API_TOKEN = process.env.CLOUDFLARE_STREAM_API_TOKEN!
const CUSTOMER_CODE = process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE!

export function getHlsUrl(videoId: string, token?: string): string {
  const base = `https://videodelivery.net/${videoId}/manifest/video.m3u8`
  return token ? `${base}?token=${token}` : base
}

export function getThumbnailUrl(videoId: string): string {
  return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg`
}

export async function getSignedToken(videoId: string): Promise<string> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/${videoId}/token`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }),
    }
  )

  if (!res.ok) throw new Error(`Failed to get signed token: ${res.statusText}`)

  const data = await res.json()
  return data.result.token as string
}
