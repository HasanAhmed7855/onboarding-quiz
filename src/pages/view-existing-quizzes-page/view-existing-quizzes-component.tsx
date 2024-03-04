import { BackButtonComponent } from "@/components/common/redirection"
import { unknownErrorMessage } from "@/helperVarsAndFunctions/commonStrings"
import { deleteQuiz } from "@/helperVarsAndFunctions/deleteQuiz"
import { takeQuizPage, viewQuizPage } from "@/helperVarsAndFunctions/pageUrls"
import { Quiz } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import globalStyle from "../../styles/Global.module.css"
import style from "../../styles/ExistingQuiz.module.css"

type ReponseData = {
    message: string
    quizzes?: Quiz[]
}

export async function fetchExistingQuizData() {
    try {
        const apiResponse = await fetch('/api/get-existing-quizzes', {
            method: 'GET'
        })
        const responseData: ReponseData = await apiResponse.json()

        if (apiResponse.ok) {
            return responseData.quizzes
        }
        else if (apiResponse.status === 404) {
            window.alert(responseData.message)
        }
        else {
            throw new Error(responseData.message)
        }

    } catch (error) {
        console.error((error as Error).message)
        window.alert(unknownErrorMessage)
    }
}

export default function ViewExistingQuizzesComponent() {
    const [quizData, setQuizData] = useState<Quiz[]>()
    const [isLoading, setIsLoading] = useState(true)

    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
        async function getApiData() {
            const result = await fetchExistingQuizData()
            if (result) {
                setQuizData(result)
                setIsAdmin(localStorage.getItem("is_admin") === "true" ? true : false)
            }
            setIsLoading(false)
        }

        getApiData()
    }, [])

    return (
        <div>
            <h2 className={globalStyle.pageTitle}> Existing Quizzes </h2>
            {/* Depending on the isLoading and quizData state, show 1 of 3 potenial views */}
            {isLoading &&
                <p>Loading...</p>
            }
            {!isLoading && !quizData &&
                <p data-testid="ViewExistingQuizzesFailMessage">Something went wrong with fetching the quizzes. Please direct back to the previous page and try again</p>
            }
            {!isLoading && quizData &&
                <>
                    {quizData.map((quiz, index) => {
                        return (
                            <div className={style.questionContainer} data-testid="ViewExistingQuizzesComponent">
                                <h2 className={globalStyle.pageTitle}>{quiz.title}</h2>
                                {isAdmin ?
                                <div className={style.actionLinkContainer}>
                                    <Link className={globalStyle.buttonStyling} href={`${viewQuizPage}?quizid=${quiz.quiz_id}`}>View Quiz</Link>
                                    <button className={globalStyle.buttonStyling} style={{"backgroundColor": "red"}} type="button" onClick={() => deleteQuiz(quiz.quiz_id, router)}>Delete Quiz</button>
                                </div>
                                :
                                <div className={style.actionLinkContainer}>
                                    <Link className={globalStyle.buttonStyling} href={`${takeQuizPage}?quizid=${quiz.quiz_id}`}>Take Quiz</Link>
                                </div>
                                }
                            </div>
                        )
                    })}
                </>
            }
            <BackButtonComponent/>
      </div>
    )
}
