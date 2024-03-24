export { default } from "next-auth/middleware"

  export const config = {
    //secret: process.env.NEXTAUTH_SECRET,
    matcher: ["/((?!$).*)"],
  };
