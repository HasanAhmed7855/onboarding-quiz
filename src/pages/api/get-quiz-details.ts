// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { quizid } = req.query
    const quizidCasted = Number(quizid)

    try {
        // Get quiz and all its info from the quiz id
        const quiz = await prisma.quiz.findUnique({
            where: {
                quiz_id: quizidCasted
            },
            include: {
                question: {
                    include: {
                        answer: true
                    }
                }
            }
        })
        
        if (quiz) {
            return res.status(200).json({ message: 'Quiz details retrieved successfully', quiz: quiz })
        }

    } catch (error) {
        return res.status(500).json({ message: (error as Error).message })
    }
    
}