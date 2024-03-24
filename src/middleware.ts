export { default } from "next-auth/middleware"

  export const config = {
    secret: process.env.NEXTAUTH_URL,
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|$).*)'],
  };
