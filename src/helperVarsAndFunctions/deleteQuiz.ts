import { MessageResponseData } from "@/types/types"
import { unknownErrorMessage } from "./commonStrings"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export async function deleteQuiz(quiz_id: number, router: AppRouterInstance) {

    if (window.confirm("Press 'OK' if you want to proceed with deleting this quiz")) {
        try {
            const apiResponse = await fetch(`/api/delete-quiz?quizid=${quiz_id}`, {
              method: 'DELETE'
            })
            const responseData: MessageResponseData = await apiResponse.json()
           
            if (apiResponse.ok) {
                window.alert(responseData.message)

                router.back()
            }
            else {
                throw new Error(responseData.message)
            }
        
        } catch (error) {
            console.error((error as Error).message)
            window.alert(unknownErrorMessage)
        }
    }
    else {
        return // Do nothing because the user has cancelled their action
    }
}