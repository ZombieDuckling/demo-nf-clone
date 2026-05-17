export type ContentType = 'movie' | 'show'
export type MaturityRating = 'kids' | 'teen' | 'adult'

export interface ContentWithGenres {
  id: string
  title: string
  description: string
  tagline: string | null
  type: ContentType
  posterUrl: string | null
  backdropUrl: string | null
  videoId: string | null
  year: number | null
  rating: string | null
  duration: number | null
  isFeatured: boolean
  genres: { id: number; name: string; slug: string }[]
}

export interface ContentWithDetails extends ContentWithGenres {
  seasons?: SeasonWithEpisodes[]
}

export interface SeasonWithEpisodes {
  id: string
  seasonNumber: number
  title: string | null
  episodes: EpisodeItem[]
}

export interface EpisodeItem {
  id: string
  episodeNumber: number
  title: string
  description: string | null
  videoId: string | null
  duration: number | null
  thumbnailUrl: string | null
}
