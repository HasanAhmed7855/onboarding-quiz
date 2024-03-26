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
    questions: Question[]
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

        // Server-side validate form inputs before writing to database

        const valuesInvalid = serverSideFormInputValidation(title, questions)
        
        if (valuesInvalid) {
            return res.status(400).json({ message: 'Server was unable to process request. Please ensure all form values are filled in appropriately' })
        }
        else {
            const dataToWrite = {
                data: {
                    title: title,
                    question: {
                        create: questions.map((question) => ({
                            question_text: question.question_text,
                            answer: {
                                create: question.answer.map((answer) => ({
                                    answer_text: answer.answer_text,
                                    is_correct_answer: (answer.is_correct_answer ? 1 : 0),
                                })),
                            },
                        })),
                    },
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
                const newQuiz = await prisma.quiz.create({
                    ...dataToWrite,
                    ...includeInQuery
                })

                if (newQuiz) {
                    return res.status(200).json({ message: 'Quiz created successfully' })
                }
            } catch (error) {
                return res.status(500).json({ message: (error as Error).message })
            }
        }

    }
    else {
        return res.status(401).json({ message: 'Server was unable to process request. Unauthorised to access page/action.' })
    }

    
}
