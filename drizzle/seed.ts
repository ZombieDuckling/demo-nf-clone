import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const GENRES = [
  { name: 'Action', slug: 'action' },
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Drama', slug: 'drama' },
  { name: 'Thriller', slug: 'thriller' },
  { name: 'Sci-Fi', slug: 'sci-fi' },
  { name: 'Horror', slug: 'horror' },
  { name: 'Documentary', slug: 'documentary' },
  { name: 'Animation', slug: 'animation' },
  { name: 'Romance', slug: 'romance' },
  { name: 'Crime', slug: 'crime' },
]

const MOVIES = [
  { title: 'The Heist', description: 'A crew of experts pull off an impossible robbery.', tagline: 'Nothing is impossible', year: 2023, rating: 'PG-13', duration: 118, genres: ['action', 'thriller'], isFeatured: true },
  { title: 'Laugh Track', description: 'A stand-up comedian navigates life and love in New York.', tagline: 'Life is the best punchline', year: 2022, rating: 'PG', duration: 95, genres: ['comedy', 'romance'], isFeatured: false },
  { title: 'Deep Space', description: 'Humanity\'s last hope travels beyond the known universe.', tagline: 'Beyond the stars', year: 2023, rating: 'PG-13', duration: 142, genres: ['sci-fi', 'drama'], isFeatured: false },
  { title: 'The Detective', description: 'A seasoned detective hunts a serial killer across three cities.', tagline: 'Every crime leaves a trace', year: 2022, rating: 'R', duration: 127, genres: ['crime', 'thriller'], isFeatured: false },
  { title: 'Haunted Manor', description: 'A family moves into a mansion with dark secrets.', tagline: 'Some doors should never be opened', year: 2023, rating: 'R', duration: 103, genres: ['horror'], isFeatured: false },
  { title: 'Canvas', description: 'An aging painter rediscovers his passion through an unlikely friendship.', tagline: 'Art never dies', year: 2021, rating: 'PG', duration: 88, genres: ['drama', 'documentary'], isFeatured: false },
  { title: 'Turbo Kids', description: 'Three kids discover a time machine in their basement.', tagline: 'Adventure has no age limit', year: 2022, rating: 'G', duration: 92, genres: ['animation', 'comedy'], isFeatured: false },
  { title: 'Northern Lights', description: 'Two strangers meet in Iceland and discover a lost civilization.', tagline: 'The world holds more secrets than you know', year: 2023, rating: 'PG-13', duration: 115, genres: ['drama', 'sci-fi'], isFeatured: false },
  { title: 'Burn Rate', description: 'A startup founder risks everything to save his company.', tagline: 'Fortune favors the bold', year: 2022, rating: 'PG-13', duration: 109, genres: ['drama', 'thriller'], isFeatured: false },
  { title: 'Ocean Protocol', description: 'Elite divers uncover an underwater conspiracy.', tagline: 'Dive deeper', year: 2023, rating: 'PG-13', duration: 121, genres: ['action', 'thriller'], isFeatured: false },
]

const SHOWS = [
  { title: 'The Grid', description: 'A hacker exposes corporate surveillance in a near-future city.', tagline: 'They are watching', year: 2022, rating: 'TV-MA', genres: ['sci-fi', 'thriller'], isFeatured: false },
  { title: 'Family Chaos', description: 'The misadventures of a hilariously dysfunctional family.', tagline: 'Normal is overrated', year: 2021, rating: 'TV-14', genres: ['comedy', 'drama'], isFeatured: false },
  { title: 'Cold Case Files', description: 'Detectives reopen unsolved murders from decades past.', tagline: 'The truth never expires', year: 2023, rating: 'TV-MA', genres: ['crime', 'drama'], isFeatured: false },
]

async function seed() {
  console.log('🌱 Seeding database...')

  // Insert genres
  const insertedGenres = await db
    .insert(schema.genres)
    .values(GENRES)
    .onConflictDoNothing()
    .returning()

  const allGenres = await db.select().from(schema.genres)
  const genreBySlug = new Map(allGenres.map((g) => [g.slug, g]))

  console.log(`✓ Genres: ${allGenres.length}`)

  // Insert movies
  for (const movie of MOVIES) {
    const { genres: genreSlugs, ...rest } = movie
    const [inserted] = await db
      .insert(schema.content)
      .values({ ...rest, type: 'movie' })
      .onConflictDoNothing()
      .returning()

    if (inserted) {
      for (const slug of genreSlugs) {
        const genre = genreBySlug.get(slug)
        if (genre) {
          await db.insert(schema.contentGenres)
            .values({ contentId: inserted.id, genreId: genre.id })
            .onConflictDoNothing()
        }
      }
    }
  }

  console.log(`✓ Movies: ${MOVIES.length}`)

  // Insert shows with seasons + episodes
  for (const show of SHOWS) {
    const { genres: genreSlugs, ...rest } = show
    const [inserted] = await db
      .insert(schema.content)
      .values({ ...rest, type: 'show' })
      .onConflictDoNothing()
      .returning()

    if (inserted) {
      for (const slug of genreSlugs) {
        const genre = genreBySlug.get(slug)
        if (genre) {
          await db.insert(schema.contentGenres)
            .values({ contentId: inserted.id, genreId: genre.id })
            .onConflictDoNothing()
        }
      }

      // Add 1 season with 3 episodes
      const [season] = await db.insert(schema.seasons)
        .values({ contentId: inserted.id, seasonNumber: 1, title: 'Season 1' })
        .returning()

      for (let ep = 1; ep <= 3; ep++) {
        await db.insert(schema.episodes).values({
          seasonId: season.id,
          episodeNumber: ep,
          title: `Episode ${ep}`,
          description: `Episode ${ep} of ${show.title}`,
          duration: 2700 + ep * 120,
        })
      }
    }
  }

  console.log(`✓ Shows: ${SHOWS.length}`)

  // Update search vectors
  await sql`
    UPDATE content SET search_vector =
      setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(tagline, '')), 'C')
  `

  console.log('✓ Search vectors updated')
  console.log('🎉 Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
