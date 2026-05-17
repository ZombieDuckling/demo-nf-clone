import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { profiles } from './profiles'
import { content } from './content'

export const myList = pgTable('my_list', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  profileId: text('profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (t) => ({
  uniqueProfileContent: unique().on(t.profileId, t.contentId),
}))

export type MyListItem = typeof myList.$inferSelect
