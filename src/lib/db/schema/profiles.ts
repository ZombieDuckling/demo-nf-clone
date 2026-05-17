import { pgTable, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users'

export const maturityRatingEnum = pgEnum('maturity_rating', ['kids', 'teen', 'adult'])

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  maturityRating: maturityRatingEnum('maturity_rating').default('adult').notNull(),
  isKids: boolean('is_kids').default(false).notNull(),
  pin: text('pin'), // hashed 4-digit PIN
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
