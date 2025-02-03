import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Check if the user has a valid session token
  if (token) {
    return NextResponse.next(); // Allow the request
  }

  // If no token, redirect to the login page
  const url = req.nextUrl.clone();
  url.pathname = "/login"; // Redirect to login page
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/profile/:path*", "/createSession/:path*", "/session/:path*", "/stats/:path*"], // Protect these routes
};
