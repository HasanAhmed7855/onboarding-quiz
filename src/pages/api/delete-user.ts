// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres'

const prisma = new PrismaClient()

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //const { username, password } = req.body

  try {
    // Get back user account information by querying username in user table
    //const holder = await sql`SELECT * FROM User`
    //await sql`ALTER SEQUENCE User_id RESTART WITH 0; `;
    const hold = await prisma.user.create({
        data: {
            user_id: 1,
            username: "hasan",
            password: "82a5c663481036616824c0510f21ede50f734e63d14e5f657716ac38f3c0f9f6",
            access_level: "regular" // Can only register regular users, admins have to be added manually for security reasons
        }
    }) 


    return res.status(200).json({ message: {hold}})
  
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message })
  }

}