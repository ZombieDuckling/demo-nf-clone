import { pgTable, text, serial } from 'drizzle-orm/pg-core'

export const genres = pgTable('genres', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
})

export type Genre = typeof genres.$inferSelect
export type NewGenre = typeof genres.$inferInsert
