import { CancelButtonComponent } from "@/components/common/redirection"
import { unknownErrorMessage } from "@/helperVarsAndFunctions/commonStrings"
import { mainMenuPage } from "@/helperVarsAndFunctions/pageUrls"
import { fetchQuizDetailsData } from "@/helperVarsAndFunctions/sharedFetchFunctions"
import { MessageResponseData, QuizDetails, UserSelectedAnswers } from "@/types/types"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import quizStyle from "../../styles/QuizDisplayPages.module.css"
import style from "../../styles/TakeQuizPage.module.css"

// Its fine that some values are undefined, backend will pick it up
async function postUserScore(
    selectedAnswers: UserSelectedAnswers[],
    quizData: QuizDetails | undefined, 
    userId: string | null | undefined,
    router: AppRouterInstance) {
    try {
        const apiResponse = await fetch('/api/return-user-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ selectedAnswers: selectedAnswers, quizId: quizData!.quiz_id, userId: userId})
        })
        const responseData: MessageResponseData = await apiResponse.json()
       
        if (apiResponse.ok) {
            window.alert(responseData.message)    
            
            router.push(mainMenuPage)
        }
        else {
            throw new Error(responseData.message)
        }
    } catch (error) {
        console.error((error as Error).message)
        window.alert(unknownErrorMessage)    
    }
}

export default function TakeQuizComponent() {
    const [quizData, setQuizData] = useState<QuizDetails>()
    const [isLoading, setIsLoading] = useState(true)

    const [userId, setUserId] = useState<string | null>()

    const router = useRouter()
    const searchParams = useSearchParams()
    const quizid = searchParams.get("quizid")

    useEffect(() => {

        async function getApiData() {
            const result = await fetchQuizDetailsData(quizid)
            if (result) {
                setQuizData(result)
            }
            setIsLoading(false)
            setUserId(localStorage.getItem("user_id"))
        }

        if (quizid) {
            getApiData()
        }
    }, [quizid])

    async function handleQuizSubmission(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // Gather user answers
        const selectedAnswers : UserSelectedAnswers[] = quizData!.question.map(question => {
            const selectedOption = document.querySelector(`input[name='${question.question_text}']:checked`) as HTMLInputElement
            return { questionAnswered: question.question_text, selectedAnswer: selectedOption ? selectedOption.value : null }
        })

        // Call API to return user score and store result in database
        postUserScore(selectedAnswers, quizData, userId, router)
    }

    return (
        <div>
            {isLoading &&
                <p>Loading...</p>
            }
            {!isLoading && !quizData &&
                <p data-testid="TakeQuizFailMessage">Something went wrong with fetching the quizzes. Please direct back to the previous page and try again</p>
            }
            {!isLoading && quizData &&
                <form className={quizStyle.quizForm} onSubmit={(e) => handleQuizSubmission(e)}>
                    <h2>{quizData.title}</h2>
                    {quizData.question.map((question, index) => (
                    <div className={quizStyle.quizQuestionContainer}>
                        <h3>{question.question_text}</h3>
                        {question.answer.map((answer, answerIndex) => (
                            <>
                                <input 
                                    type={"radio"}
                                    name={question.question_text} // question_text used to differentiate between groups of radio buttons
                                    value={answer.answer_text} // answer_text set as the value of the radio buttons
                                />
                                <label>{answer.answer_text}</label>
                                <br/>
                            </>
                        ))}
                    </div>
                    ))}
                    <button className={style.submitButton} type="submit"> Submit </button>
                </form>
            }
            <CancelButtonComponent/>
        </div>
    )
}