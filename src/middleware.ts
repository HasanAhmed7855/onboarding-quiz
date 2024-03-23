import withAuth from "next-auth/middleware";

export default withAuth({
    secret: process.env.SECRET,
  });

export const config = {
    // Dont run authentication on app entry page
    matcher: ["/((?!$).*)"],
  };