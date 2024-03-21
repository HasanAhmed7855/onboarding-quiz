// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, password } = req.body

  try {
    return res.status(200).json({ message: 'Quiz successfully deleted' })

    /*
    if(!username.trim() || !password.trim()) {
      return res.status(400).json({ message: "Please do not leave the username or password empty. Inputs with just whitespace isn't allowed" })
    }
 
    // Get back user account information by querying username in user table
    const accountInfo = await prisma.user.findUnique({
      where: {
          username: username
      }
    })

    // If username not in db, fail authentication
    if(!accountInfo) {
      return res.status(401).json({ message: 'Authentication failed, incorrect username or password. Please try again' }) 
    }

    // Prisma docs (no date)
    const hashedPassword = createHash('sha256').update(password).digest('hex')
    const samePassword = hashedPassword === accountInfo.password
    // If password entered into form matches password in db, succeed authentication
    if (samePassword) {
      const isAdmin = accountInfo.access_level === "admin"
      const userId = accountInfo.user_id

      return res.status(200).json({ message: 'Authentication successful', is_admin: isAdmin, user_id: userId })
    }
    else {
      return res.status(401).json({ message: 'Authentication failed, incorrect username or password. Please try again' })
    }
    */
  
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message })
  }

}
