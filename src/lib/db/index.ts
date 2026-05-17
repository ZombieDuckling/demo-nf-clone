import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

type DB = NeonHttpDatabase<typeof schema>

let _db: DB | undefined

function lazyDb(): DB {
  if (!_db) {
    _db = drizzle(neon(process.env.DATABASE_URL!), { schema })
  }
  return _db
}

// Proxy so all existing `db.select()` etc. calls work without changes
export const db = new Proxy({} as DB, {
  get(_, prop: string) {
    return lazyDb()[prop as keyof DB]
  },
})
