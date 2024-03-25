import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { BackButtonComponent } from "@/components/common/redirection"
import { deleteQuiz } from "@/helperVarsAndFunctions/deleteQuiz"
import { QuizDetails } from "@/types/types"
import { buildQuizPage } from "@/helperVarsAndFunctions/pageUrls"
import globalStyle from "../../styles/Global.module.css"
import style from "../../styles/ViewQuizPage.module.css"
import { fetchQuizDetailsData } from "@/helperVarsAndFunctions/sharedFetchFunctions"
import { signIn, useSession } from "next-auth/react"

export default function ViewQuizComponent() {
    const { data: session, status } = useSession()
    
    const [quizData, setQuizData] = useState<QuizDetails>()
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    const searchParams = useSearchParams()
    const quizid = searchParams.get("quizid")

    function directToEditQuizPage(quizData: QuizDetails) {
        // Save quiz details in localStorage
        localStorage.setItem("quizData", JSON.stringify(quizData))

        router.push(buildQuizPage)
    }

    if (status === "loading") {
        return <p>Gathering information...</p>
    }

    if (status === "authenticated" && session.user.role === "ADMIN") {
        useEffect(() => {

            async function getApiData() {
                const result = await fetchQuizDetailsData(quizid)
                if (result) {
                    setQuizData(result)
                }
                setIsLoading(false)
            }
    
            if (quizid) {
                getApiData()
            }
        }, [quizid])
    
        if (isLoading) return <p>Loading...</p>
    
        return (
          <div className={style.entireQuizContainer}>
            {/* Depending on the isLoading and quizData state, show 1 of 3 potenial views */}
            {isLoading &&
                <p>Loading...</p>
            }
            {!isLoading && !quizData &&
                <p data-testid="ViewQuizFailMessage">Something went wrong with fetching the quizzes. Please direct back to the previous page and try again</p>
            }
            {!isLoading && quizData &&
                <>
                    <div>
                        <h2 className={globalStyle.pageTitle}>{quizData.title}</h2>
                        {quizData.question.map((question, index) => (
                            <>
                                <h3>{question.question_text}</h3>
                                <ul>
                                    {question.answer.map((answer, answerIndex) => (
                                        <li key={answerIndex}>{answer.answer_text} {answer.is_correct_answer ? <i style={{"color": "green"}}>{"<- Correct answer"}</i> : null} </li> 
                                    ))}
                                </ul>
                            </>
                        ))}
                        <div className={style.actionButtonContainer}>
                            <button className={globalStyle.buttonStyling} type="button" onClick={() => directToEditQuizPage(quizData)}>Edit Quiz</button>
                            <button className={globalStyle.buttonStyling} style={{"backgroundColor": "red"}} type="button" onClick={() => deleteQuiz(Number(quizid), router)}>Delete Quiz</button>
                        </div>
                    </div>
                </>
            }
            <BackButtonComponent/>
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