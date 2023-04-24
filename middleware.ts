import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * if signed in, redirect from /signin and /signup to /dashboard
 * if not, redirect from anywhere to /signin, but let some system relevant urls pass
 * 
 * seriously, why is the new nextjs middleware so scuffed? am i missing something?
 * i'm all for handling redirects with conditional logic instead of regex,
 * but can vercel please let me define multiple middleware files again?
 * like what the fuck, am i just supposed to continue bloating this?
 * am i missing something?
 */
export async function middleware(
  req: NextRequest,
) {
  const token = await getToken({
    req,
    secret: process.env.SECRET,
  });

  if (["/signin", "/signup"].some(slug => req.nextUrl.pathname.startsWith(slug))) {
    console.log("in dings page")
    if (token != null) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next();
  }
  if (["/api", "/_next/static", "/favicon.ico"].some(slug => req.nextUrl.pathname.startsWith(slug))) return NextResponse.next();

  if (token == null) return NextResponse.redirect(new URL('/signin', req.url))

  return NextResponse.next();
}