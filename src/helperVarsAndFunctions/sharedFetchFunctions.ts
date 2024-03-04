import { GetQuizDetailsReponseData } from "@/types/types"
import { unknownErrorMessage } from "./commonStrings"

export async function fetchQuizDetailsData(quizid: string | null) {
    try {
        const apiResponse = await fetch(`/api/get-quiz-details?quizid=${quizid}`, {
            method: 'GET'
        })
        const responseData: GetQuizDetailsReponseData = await apiResponse.json()

        if (apiResponse.ok) {
            return responseData.quiz
        }
        else {
            throw new Error(responseData.message)
        }

    } catch (error) {
        console.error((error as Error).message)
        window.alert(unknownErrorMessage)
    }
}