export { default } from "next-auth/middleware"

  export const config = {
    secret: process.env.NEXTAUTH_SECRET,
    //secret: "88962134c21d96c282b95859b6cd962c",
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|$).*)'],
  };
