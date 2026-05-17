import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next()

  const { userId } = await auth()

  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Check for active profile cookie (skip for profile selection routes)
  const isProfileRoute = req.nextUrl.pathname.startsWith('/profiles')
  const isAccountRoute = req.nextUrl.pathname.startsWith('/account')
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  if (!isProfileRoute && !isAccountRoute && !isApiRoute) {
    const profileCookie = req.cookies.get('active_profile_id')
    if (!profileCookie?.value) {
      return NextResponse.redirect(new URL('/profiles', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
