export { default } from "next-auth/middleware"

export const config = {
    // Dont run authentication on app entry page
    matcher: ["/((?!$).*)"],
    secret: process.env.NEXTAUTH_SECRET
  };