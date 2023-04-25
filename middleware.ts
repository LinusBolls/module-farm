import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * if signed in, redirect from /signin and /signup to /
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
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next();

  }
  console.log(req.nextUrl.pathname)

  // if (["/api", "/_next/static", "/favicon.ico", "/abstractBackground.svg"].some(slug => req.nextUrl.pathname.startsWith(slug))) return NextResponse.next();

  if (token == null && ["/", "/settings"].includes(req.nextUrl.pathname) || req.nextUrl.pathname.startsWith("/organizations")) return NextResponse.redirect(new URL('/signin', req.url))

  // the code below is used to pass the nextjs session cookies on to
  // the realtime service for authorization

  const realtimeServiceDomain = "localhost:5050"

  const headers = new Headers(req.headers)

  // const setCookieHeader = `${req.cookies.toString()}; Domain=${realtimeServiceDomain}; Path=/; HttpOnly; SameSite=None; Secure`
  

  const domainValue = `Domain=${realtimeServiceDomain};`

  const setCookieHeader = `${req.cookies.toString()}; ${process.env.NODE_ENV === "production" ? domainValue : ""} Path=/; HttpOnly; SameSite=None`

  headers.set('Set-Cookie', setCookieHeader)

  return NextResponse.next({
    request: {
      headers,
    },
  })
}