import { pgTable, text, timestamp, boolean, integer, pgEnum, customType, serial } from 'drizzle-orm/pg-core'
import { genres } from './genres'

export const contentTypeEnum = pgEnum('content_type', ['movie', 'show'])

const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector'
  },
})

export const content = pgTable('content', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  tagline: text('tagline'),
  type: contentTypeEnum('type').notNull(),
  posterUrl: text('poster_url'),
  backdropUrl: text('backdrop_url'),
  videoId: text('video_id'), // Cloudflare Stream video ID (movies only)
  year: integer('year'),
  rating: text('rating'), // e.g. PG-13, R
  duration: integer('duration'), // minutes (movies only)
  isFeatured: boolean('is_featured').default(false).notNull(),
  searchVector: tsvector('search_vector'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const contentGenres = pgTable('content_genres', {
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  genreId: integer('genre_id').notNull().references(() => genres.id, { onDelete: 'cascade' }),
})

export const seasons = pgTable('seasons', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  seasonNumber: integer('season_number').notNull(),
  title: text('title'),
})

export const episodes = pgTable('episodes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  seasonId: text('season_id').notNull().references(() => seasons.id, { onDelete: 'cascade' }),
  episodeNumber: integer('episode_number').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  videoId: text('video_id'), // Cloudflare Stream video ID
  duration: integer('duration'), // seconds
  thumbnailUrl: text('thumbnail_url'),
})

export type Content = typeof content.$inferSelect
export type NewContent = typeof content.$inferInsert
export type Season = typeof seasons.$inferSelect
export type Episode = typeof episodes.$inferSelect
