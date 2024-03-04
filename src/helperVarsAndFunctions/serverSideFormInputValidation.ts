import { Question } from "@/types/types"

export function serverSideFormInputValidation(title: string, questions: Question[]) {
    const areAllQuestionInputsValid = questions.every((question, index) => {
        return (question.question_text.trim() !== '' && question.answer.length > 1 )
    })

    // Valid if answers are valid
    let stopForEachLoop = false
    let flagAnswerInputsAsInvalid = false
    let flagCorrectAnswerPerQuestionInvalid = false
    questions.forEach((question, index) => {
        if (stopForEachLoop) {
            return
        }

        const areAllAnswerInputsValidLocalScope = question.answer.every((answer, answerIndex) => {
            return (answer.answer_text.trim() !== '')
        })
        if (!areAllAnswerInputsValidLocalScope) {
            stopForEachLoop = true
            flagAnswerInputsAsInvalid = true
        }

        // Checks to see if there is at least 1 correct answer per question
        const isThereOneCorrectAnswerPerQuestionLocalScope = question.answer.some((answer, answerIndex) => {
            return (answer.is_correct_answer)
        })
        if (!isThereOneCorrectAnswerPerQuestionLocalScope) {
            stopForEachLoop = true
            flagCorrectAnswerPerQuestionInvalid = true
        }
    })
    
    const valuesInvalid = !title.trim() || questions.length === 0 || !areAllQuestionInputsValid || flagAnswerInputsAsInvalid || flagCorrectAnswerPerQuestionInvalid

    return valuesInvalid
}