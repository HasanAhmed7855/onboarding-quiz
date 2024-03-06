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
    const holder = await sql`SELECT * FROM User`
    //await sql`ALTER SEQUENCE User_id RESTART WITH 0; `;
    /*
    await prisma.user.delete({
      where: {
          username: "ahmed"
      }
    })
    */

    return res.status(200).json({ message: {holder}})
  
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message })
  }

}