import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { Adapter } from "next-auth/adapters"

const prisma = new PrismaClient()

export default NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ? process.env.GITHUB_ID : "",
            clientSecret: process.env.GITHUB_SECRET ? process.env.GITHUB_SECRET : "",
            /*
            profile(profile) {
                return { role: profile.role ?? "regular", ...profile }
            }
            */
        }),
    ],
    /*
    callbacks: {
        session({ session, user }) {
            session.user!.role = user.role
            return session
        }
    },
    */
    secret: process.env.NEXTAUTH_SECRET
})