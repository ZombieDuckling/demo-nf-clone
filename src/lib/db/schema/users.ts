import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'standard', 'premium'])
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'inactive', 'cancelled', 'trialing'])

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk userId
  email: text('email').notNull(),
  subscriptionTier: subscriptionTierEnum('subscription_tier').default('free').notNull(),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').default('inactive').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
