// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {

    try {
        // Get all quizzes in the Quiz table
        const getQuizzes = await prisma.quiz.findMany()

        if (getQuizzes) {
            if (getQuizzes.length === 0) {
                return res.status(404).json({ message: 'No quizzes found in the database, contact the admin ' })
            }
            else {
                return res.status(200).json({ message: 'Quizzes retrieved successfully', quizzes: getQuizzes })
            }
        }
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message })
    }
}