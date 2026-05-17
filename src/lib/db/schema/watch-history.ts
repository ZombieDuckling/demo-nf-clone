import { pgTable, text, timestamp, boolean, integer, unique } from 'drizzle-orm/pg-core'
import { profiles } from './profiles'
import { content } from './content'

export const watchHistory = pgTable('watch_history', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  profileId: text('profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  episodeId: text('episode_id'), // null for movies
  watchedSeconds: integer('watched_seconds').default(0).notNull(),
  completed: boolean('completed').default(false).notNull(),
  lastWatchedAt: timestamp('last_watched_at').defaultNow().notNull(),
}, (t) => ({
  uniqueProfileContent: unique().on(t.profileId, t.contentId),
}))

export type WatchHistory = typeof watchHistory.$inferSelect
export type NewWatchHistory = typeof watchHistory.$inferInsert
