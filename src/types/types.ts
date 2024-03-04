export type Answer = {
    answer_text: string
    is_correct_answer: boolean
    answer_id: number
}

export type Question = {
    question_text: string
    answer: Answer[]
    question_id: number
}

type AnswerDetail = {
    answer_id: number,
    answer_text: string,
    is_correct_answer: number,
    question_id: number
}

type QuestionDetails = {
    question_id: number,
    question_text: string,
    quiz_id: number,
    answer: AnswerDetail[]
}

export type QuizDetails = {
    quiz_id: number,
    title: string,
    question: QuestionDetails[]
}

export type GetQuizDetailsReponseData = {
    message: string
    quiz?: QuizDetails
}

export type MessageResponseData = {
    message: string
}

export type UserSelectedAnswers = {
    questionAnswered : string,
    selectedAnswer: string | null
}