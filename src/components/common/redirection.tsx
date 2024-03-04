import { entryPage, mainMenuPage } from "@/helperVarsAndFunctions/pageUrls"
import {useRouter} from "next/navigation"
import globalStyle from "@/styles/Global.module.css"

export const CancelButtonComponent = () => {
    const router = useRouter()

    function navigateToMainMenu() {
        router.push(mainMenuPage)
    }

    return (
        <button className={globalStyle.buttonStyling} type="button" onClick={navigateToMainMenu}>
            Cancel
        </button>
    )
}

export const LogoutButtonComponent = () => {
    const router = useRouter()

    function navigateToEntryPageAndClearLocalStorage() {
        localStorage.clear()

        router.push(entryPage)
    }

    return (
        <button className={globalStyle.buttonStyling} type="button" onClick={navigateToEntryPageAndClearLocalStorage}>
            Logout
        </button>
    )
}

export const BackButtonComponent = () => {
    const router = useRouter()

    return (
        <button className={globalStyle.buttonStyling} type="button" onClick={() => router.back()}>
            Back
        </button>
    )
}