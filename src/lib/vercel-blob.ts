import { put } from '@vercel/blob'

export async function uploadImage(
  file: File,
  folder: 'posters' | 'backdrops' | 'avatars'
): Promise<string> {
  const filename = `${folder}/${Date.now()}-${file.name}`
  const blob = await put(filename, file, { access: 'public' })
  return blob.url
}
