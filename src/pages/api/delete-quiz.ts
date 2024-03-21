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
        // Prisma docs (no date)
        const deletedQuiz = await prisma.$transaction(async (prisma) => { // transaction ensures the deletes are executes together, not seperately
            
            // Order of deletion: answers -> questions -> quiz
            // Prisma docs (no date)
            await prisma.answer.deleteMany({
                where: {
                    question: {
                        quiz_id: quizidCasted
                    }
                }
            })
            
            await prisma.question.deleteMany({
                where: {
                    quiz_id: quizidCasted
                }
            })
            
            // Prisma docs (no date)
            return prisma.quiz.delete({ // return last operation because it shows that all the previous operations were successful
                where: {
                    quiz_id: quizidCasted
                }
            })
        })

        if (deletedQuiz) {
            return res.status(200).json({ message: 'Quiz successfully deleted' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: (error as Error).message })
    }
}