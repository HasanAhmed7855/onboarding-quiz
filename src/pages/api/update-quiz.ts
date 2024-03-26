// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { serverSideFormInputValidation } from '@/helperVarsAndFunctions/serverSideFormInputValidation'
import { Question } from '@/types/types'
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

type RequestBody = {
    title: string,
    questions: Question[],
    quizId: number
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if(session?.user.role === "ADMIN") {

        const requestBody: RequestBody = req.body
        const title = requestBody.title
        const questions = requestBody.questions
        const quizId = requestBody.quizId

        // Server-side validate form inputs before writing to database
        const valuesInvalid = serverSideFormInputValidation(title, questions)

        if (valuesInvalid) {
            return res.status(400).json({ message: 'Server was unable to process request. Please ensure all form values are filled in appropriately' })
        }
        else {
            const dataToWrite = {
                where: {
                    quiz_id: quizId
                },
                data: {
                    title: title,
                    question: {
                        upsert: questions.map((question) => {
                            return {
                                where: { 
                                    question_id: question.question_id 
                                },
                                update: { // Runs this if the question_id already exists
                                    question_text: question.question_text,
                                    answer: {
                                        upsert: question.answer.map((answer) => {
                                            return {
                                                where: { answer_id: answer.answer_id },
                                                update: { // Runs this if the answer_id already exists
                                                    answer_text: answer.answer_text,
                                                    is_correct_answer: (answer.is_correct_answer ? 1 : 0)
                                                },
                                                create: { // Runs this if the answer_id doesn't exist (new answer)
                                                    answer_text: answer.answer_text,
                                                    is_correct_answer: (answer.is_correct_answer ? 1 : 0)
                                                }
                                            }
                                        })
                                    }
                                },
                                create: { // Runs this if the question_id doesn't exist (new question)
                                    question_text: question.question_text,
                                    answer: {
                                        create: question.answer.map((answer) => ({
                                            answer_text: answer.answer_text,
                                            is_correct_answer: (answer.is_correct_answer ? 1 : 0)
                                        }))
                                    }
                                }
                            }
                        })
                    }
                }
            }

            const includeInQuery = {
                include: {
                    question: {
                        include: {
                            answer: true
                        }
                    }
                }
            }

            try {
                const updatedQuiz = await prisma.$transaction(async (prisma) => {

                    // Order of operation: delete answers -> delete question -> update quiz
                    await prisma.answer.deleteMany({
                        where: {
                            question: {
                                quiz_id: quizId,
                                NOT: {
                                    question_id: {
                                        in: questions.map((question) => question.question_id)
                                    }
                                }
                            }
                        }
                    })
        
                    await prisma.question.deleteMany({
                        where: {
                            quiz_id: quizId,
                            NOT: {
                                question_id: {
                                    in: questions.map((question) => question.question_id) 
                                }
                            }
                        }
                    })
        
                    return prisma.quiz.update({ // return last operation because it shows that all the previous operations were successful
                        ...dataToWrite,
                        ...includeInQuery
                    })
        
                })
        
        
                if (updatedQuiz) {
                    return res.status(200).json({ message: 'Quiz updated successfully. Redirecting to mainmenu...' })
                }

            } catch (error) {
                return res.status(500).json({ message: (error as Error).message })
            }
        }

    }
    
}
