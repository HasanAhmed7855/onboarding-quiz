// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //const { username, password } = req.body

  try {
    // Get back user account information by querying username in user table
    await prisma.user.delete({
      where: {
          username: "hasan"
      }
    })

    return res.status(200) 
  
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message })
  }

}