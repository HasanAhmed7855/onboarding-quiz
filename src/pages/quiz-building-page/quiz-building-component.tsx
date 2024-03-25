import { CancelButtonComponent } from "@/components/common/redirection"
import { unknownErrorMessage } from "@/helperVarsAndFunctions/commonStrings"
import { mainMenuPage } from "@/helperVarsAndFunctions/pageUrls"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Question, Answer, MessageResponseData } from "../../types/types"
import globalStyle from "../../styles/Global.module.css"
import style from "../../styles/QuizDisplayPages.module.css"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import { signIn, useSession } from "next-auth/react"

const Title = (props: {
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
}) => {
    const {title, setTitle} = props

    return (
        <div>
            <input
                type="text"
                name="formtitle"
                placeholder="Quiz title..."
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
        </div>
    )
}

const Answer = (props: {
    answer: Answer,
    answerIndex: number,
    questionId: number,
    handleAnswerChange: (e: React.ChangeEvent<HTMLInputElement>, questionId: number, answerId: number) => void,
    handleCorrectAnswerChange: (e: React.ChangeEvent<HTMLInputElement>, questionId: number, answerId: number) => void,
    removeAnswer: (questionId: number, answerId: number) => void
}) => {
    const {answer, answerIndex, questionId, handleAnswerChange, handleCorrectAnswerChange, removeAnswer} = props

    return (
        <div key={answerIndex}>
            <input type="radio" name={`correct-answer-${questionId}`} checked={answer.is_correct_answer} onChange={(e) => handleCorrectAnswerChange(e, questionId, answer.answer_id)} />

            <input type="text" placeholder={`Answer ${answerIndex + 1}`} value={answer.answer_text} onChange={(e) => handleAnswerChange(e, questionId, answer.answer_id)} />
            
            <button type="button" onClick={() => removeAnswer(questionId, answer.answer_id)}>Remove Answer</button>
        </div>
    )
}

const Question = (props: {
    question: Question, index: number,
    handleQuestionChange: (e: React.ChangeEvent<HTMLInputElement>, questionId: number) => void,
    addAnswer: (questionId: number) => void,
    removeQuestion: (questionId: number) => void,
    handleAnswerChange: (e: React.ChangeEvent<HTMLInputElement>, questionId: number, answerId: number) => void,
    handleCorrectAnswerChange: (e: React.ChangeEvent<HTMLInputElement>, questionId: number, answerId: number) => void,
    removeAnswer: (questionId: number, answerId: number) => void
}) => {
    const {question, index, handleQuestionChange, addAnswer, removeQuestion, handleAnswerChange, handleCorrectAnswerChange, removeAnswer} = props

    return (
        <div className={style.quizQuestionContainer} key={index}>
            <input type="text" placeholder={`Question ${index + 1}`} value={question.question_text} onChange={(e) => handleQuestionChange(e, question.question_id)} />
            {question.answer.map((answer, answerIndex) => (
                <Answer
                    key={answerIndex}
                    answer={answer}
                    answerIndex={answerIndex}
                    questionId={question.question_id}
                    handleAnswerChange={handleAnswerChange}
                    handleCorrectAnswerChange={handleCorrectAnswerChange}
                    removeAnswer={removeAnswer}
                />
            ))}
            <button type="button" onClick={() => addAnswer(question.question_id)}>+ Add Answer</button>
            <button type="button" onClick={() => removeQuestion(question.question_id)}>- Remove Question</button>
        </div>
    )
}

async function callApiToCreateNewQuiz(
    title: string,
    questions: Question[],
    setErrorMessages: React.Dispatch<React.SetStateAction<string[] | string>>,
    router: AppRouterInstance) {
    try {
        const apiResponse = await fetch('/api/create-new-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title, questions: questions})
        })
        const responseData: MessageResponseData = await apiResponse.json()
       
        if (apiResponse.ok) { // apiResponse.ok = successful (returned back status codes 200-299)
            setErrorMessages([])
            
            window.alert(responseData.message)

            router.push(mainMenuPage)
        }
        else {
            throw new Error(responseData.message)
        }
    
    } catch (error) {
        console.error((error as Error).message)
        setErrorMessages(unknownErrorMessage)
    }
}

async function callApiToUpdateQuiz(
    title: string,
    questions: Question[],
    quizId: number,
    setErrorMessages: React.Dispatch<React.SetStateAction<string[] | string>>,
    router: AppRouterInstance) {
    try {
        const apiResponse = await fetch('/api/update-quiz', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title, questions: questions, quizId: quizId})
        })
        const responseData: MessageResponseData = await apiResponse.json()
       
        if (apiResponse.ok) {
            setErrorMessages([])
            
            window.alert(responseData.message)

            router.push(mainMenuPage)
        }
        else if (apiResponse.status === 400) {
            setErrorMessages(responseData.message)
        }
        else {
            throw new Error(responseData.message)
        }
    
    } catch (error) {
        console.error((error as Error).message)
        setErrorMessages(unknownErrorMessage)
    }
}

const QuizBuildingComponent = () => {
    const { data: session, status } = useSession()

    const [quizId, setQuizId] = useState<number>()
    const [title, setTitle] = useState<string>('')
    const [questions, setQuestions] = useState<Question[]>([])
    const [errorMessages, setErrorMessages] = useState<string[] | string>([])

    const router = useRouter()

    const [questionId, setQuestionId] = useState<number>(0)
    const [answerId, setAnswerId] = useState<number>(0)

    if (status === "loading") {
        return <p>Gathering information...</p>
    }

    function validateFormInputs() {
        const errorMessages: string[] = []

        // Show error message when title empty
        if (!title.trim()) {
            errorMessages.push("Give the quiz an appropriate title. Ensure the title field isnt empty or just has white space")
        }

        // Show error message if there isnt any questions
        if (questions.length === 0) {
            errorMessages.push("The quiz must have at least 1 question")
        }

        // Show error message if theres no question text, or isn't multiple answers for the question
        const areAllQuestionInputsValid = questions.every((question, index) => {
            return (question.question_text.trim() !== '' && question.answer.length > 1 )
        })
        if (!areAllQuestionInputsValid) {
            errorMessages.push("Ensure each quiz question input isnt empty or just has white space. Also ensure that they have multiple answers to pick from")
        }

        // Go over each question, check if all answer texts are populated and there is a isCorrect answer in each question
        // Stop the forEach loop from iterating next question because only one error message per missing item needs to be shown.
        let stopForEachLoop = false
        questions.forEach((question, index) => {
            if (stopForEachLoop) {
                return
            }

            const areAllAnswerInputsValid = question.answer.every((answer, answerIndex) => {
                return (answer.answer_text.trim() !== '')
            })
            if (!areAllAnswerInputsValid) {
                errorMessages.push("Ensure each answer input isnt empty or just has white space")
                stopForEachLoop = true
            }

            // Checks to see if there is at least 1 correct answer per question
            const isThereOneCorrectAnswerPerQuestion = question.answer.some((answer, answerIndex) => {
                return (answer.is_correct_answer)
            })
            if (!isThereOneCorrectAnswerPerQuestion) {
                errorMessages.push("Ensure each question has a correct answer chosen")
                stopForEachLoop = true
            }
        })

        return errorMessages
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>, setErrorMessages: React.Dispatch<React.SetStateAction<string[] | string>>) {
        e.preventDefault()

        const errorMessages = validateFormInputs()

        // Display error messages or proceed with publishing quiz
        if (errorMessages.length > 0) {
            setErrorMessages(errorMessages)
        }
        else {
            setErrorMessages([])

            quizId ?
            callApiToUpdateQuiz(title, questions, quizId, setErrorMessages, router) :
            callApiToCreateNewQuiz(title, questions, setErrorMessages, router)
        }

    }

    function findIndexValueOfQuestionId(updatedQuestions: Question[], questionId: number) {
        return updatedQuestions.findIndex(
            (question) => question.question_id == questionId
        )
    }

    function findIndexValueOfAnswerId(updatedQuestions: Question[], questionIndexValue: number, answerId: number) {
        return updatedQuestions[questionIndexValue].answer.findIndex(
            ((answer) => answer.answer_id == answerId)
        )
    }

    function addQuestion() {
        setQuestions([...questions, { question_text: "", answer: [], question_id: questionId }])
        setQuestionId(questionId + 1)
    }

    function handleQuestionChange(e: React.ChangeEvent<HTMLInputElement>, questionId: number) {
        const updatedQuestions = [...questions]

        const questionIndexValue = findIndexValueOfQuestionId(updatedQuestions, questionId)

        updatedQuestions[questionIndexValue].question_text = e.target.value
        setQuestions(updatedQuestions)
    }

    function addAnswer(questionId: number) {
        const updatedQuestions = [...questions]

        const questionIndexValue = findIndexValueOfQuestionId(updatedQuestions, questionId)

        updatedQuestions[questionIndexValue].answer.push({ answer_text: '', is_correct_answer: false, answer_id: answerId })
        setQuestions(updatedQuestions)
        setAnswerId(answerId + 1)
    }

    function handleAnswerChange(e: React.ChangeEvent<HTMLInputElement>, questionId: number, answerId: number) {
        const updatedQuestions = [...questions]

        const questionIndexValue = findIndexValueOfQuestionId(updatedQuestions, questionId)
        const answerIndexValue = findIndexValueOfAnswerId(updatedQuestions, questionIndexValue, answerId)

        updatedQuestions[questionIndexValue].answer[answerIndexValue].answer_text = e.target.value
        setQuestions(updatedQuestions)
    }

    function handleCorrectAnswerChange(e: React.ChangeEvent<HTMLInputElement>, questionId: number, answerId: number) {
        const updatedQuestions = [...questions]

        const questionIndexValue = findIndexValueOfQuestionId(updatedQuestions, questionId)
        const answerIndexValue = findIndexValueOfAnswerId(updatedQuestions, questionIndexValue, answerId)

        updatedQuestions[questionIndexValue].answer.map((answer) => {
            answer.is_correct_answer = false
        })

        updatedQuestions[questionIndexValue].answer[answerIndexValue].is_correct_answer = e.target.checked
        setQuestions(updatedQuestions)
    }

    function removeQuestion(questionId: number) {
        const updatedQuestions = [...questions]

        const questionIndexValue = findIndexValueOfQuestionId(updatedQuestions, questionId)

        updatedQuestions.splice(questionIndexValue, 1)
        setQuestions(updatedQuestions)
    }

    function removeAnswer(questionId: number, answerId: number) {
        const updatedQuestions = [...questions]

        const questionIndexValue = findIndexValueOfQuestionId(updatedQuestions, questionId)
        const answerIndexValue = findIndexValueOfAnswerId(updatedQuestions, questionIndexValue, answerId)

        updatedQuestions[questionIndexValue].answer.splice(answerIndexValue, 1)
        setQuestions(updatedQuestions)
    }

    if (status === "authenticated" && session.user.role === "ADMIN") {
        useEffect(() => {
            // get quizData from localStorage then set state to popular the quiz form inputs
            const quizDatalocalStorage = localStorage.getItem("quizData")
            if (quizDatalocalStorage) {
                const quizData = JSON.parse(quizDatalocalStorage)
                setTitle(quizData.title)
                setQuestions(quizData.question)
                setQuizId(quizData.quiz_id)
                
                localStorage.removeItem("quizData")
            }
        }, [])
    
        return (
        <div>
            <h2 className={globalStyle.pageTitle}> {quizId ? "Edit quiz page" : "Create A New Quiz"}</h2>
            <form className={style.quizForm} onSubmit={(e) => handleSubmit(e, setErrorMessages)}>
                <Title title={title} setTitle={setTitle}/>
    
                {questions.map((question, index) => (
                    <Question
                        key={index}
                        question={question}
                        index={index}
                        handleQuestionChange={handleQuestionChange}
                        addAnswer={addAnswer}
                        removeQuestion={removeQuestion}
                        handleAnswerChange={handleAnswerChange}
                        handleCorrectAnswerChange={handleCorrectAnswerChange}
                        removeAnswer={removeAnswer}
                    />
                ))}
                <button type="button" onClick={addQuestion}>+ Add Question</button>
                
                <div className={globalStyle.groupingContainer}>
                    <CancelButtonComponent/>
                    <button className={globalStyle.buttonStyling} style={{"backgroundColor": "#0ce943"}} type="submit">Publish</button>
                </div>
                
                {errorMessages?.length > 0 &&
                <div style={{color: "red", alignSelf: "center"}}>
                    <p>Please address these issue before publishing a quiz:</p>
                    <ul className={style.quizListStyling}>
                        {errorMessages instanceof Array ?
                            errorMessages.map((errorMessage, index) => (
                                <li key={index}>{errorMessage}</li>
                            ))
                            :
                            <li>{errorMessages}</li>
                        }
                    </ul>
                </div>}
            </form>
        </div>
        )
    }

    // NEED IF STATEMENT IF THEY TRY TO ACCESS THIS PAGE WITHOUT PROPER USER ROLE
    return (
        <>
          <p>Not signed in.</p>
          <button onClick={() => signIn("github")}>Sign in</button>
        </>
    )
}

export default QuizBuildingComponent // Big file so exporting default component this way to make it more identifiable