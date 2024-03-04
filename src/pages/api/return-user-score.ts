// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { UserSelectedAnswers } from '@/types/types'
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

type RequestBody = {
    selectedAnswers: UserSelectedAnswers[],
    quizId: string,
    userId: string
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const requestBody: RequestBody = req.body
    const selectedAnswers = requestBody.selectedAnswers
    const quizId = requestBody.quizId
    const userId = requestBody.userId

    const quizidCasted = Number(quizId)

    let totalScore = 0

    try {
        // Get the quiz questions and the correct answer for each of them
        // Prisma docs (no date)
        const quizQuestionsWithCorrectAnswers = await prisma.question.findMany({
            where: {
                quiz_id: quizidCasted
            },
            include: {
                answer: {
                    where: {
                        is_correct_answer: 1
                    }
                }
            }
        })


        if (quizQuestionsWithCorrectAnswers) {
            // Map the quizQuestion with the correct answer
            const quizQuestionsWithCorrectAnswersMap = quizQuestionsWithCorrectAnswers.map((question) => {
                const correctAnswer = question.answer[0].answer_text
                return { quizQuestion: question.question_text, correctAnswer: correctAnswer}
            })

            // Find the same question in both selectedAnswers and quizQuestionsWithCorrectAnswersMap
            // Then compare the users select answer with the correct answer
            // Give a point if the answers are the same
            selectedAnswers.forEach((selectedAnswer) => {
                const sameQuestion = quizQuestionsWithCorrectAnswersMap.find(question => question.quizQuestion === selectedAnswer.questionAnswered)

                if (selectedAnswer.selectedAnswer === sameQuestion?.correctAnswer) {
                    totalScore = totalScore + 1
                }
            })

            // Write user score to database
            const writeUserResult = await prisma.user_To_Quiz_Link.create({
                data: {
                    user_id: Number(userId),
                    quiz_id: quizidCasted,
                    score: totalScore, 
                }
            })

            if (writeUserResult) {
                const amountOfQuestionsInQuiz = quizQuestionsWithCorrectAnswersMap.length
                res.status(200).json({ message: `You got ${totalScore} out of ${amountOfQuestionsInQuiz}. Directing you back to mainmenu...` })
            }
        }

    } catch (error) {
        return res.status(500).json({ message: (error as Error).message })
    }
}