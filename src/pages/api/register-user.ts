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
    /* if(!username.trim() || !password.trim()) {
      return res.status(400).json({ message: "Please do not leave the username or password empty. Inputs with just whitespace isn't allowed" })
    }
  
    // Check if user already exists
    const doesUserAlreadyExist = await prisma.user.findUnique({
      where: {
          username: username
      }
    })
  
    if (doesUserAlreadyExist) {
      return res.status(409).json({ message: 'That user already exists. Please login with those credentials or register with a different username' })
    }
    else {
      const hashedPassword = createHash('sha256').update(password).digest('hex')
  
      // Prisma docs (no date)
      const registerAccount = await prisma.user.create({
          data: {
              username: username,
              password: hashedPassword,
              access_level: "regular" // Can only register regular users, admins have to be added manually for security reasons
          }
      }) 
  
      if (registerAccount) {    
          return res.status(200).json({ message: 'Account creation successful. Redirecting to entry page...' })
      }
    }
 */
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message })
  }
}