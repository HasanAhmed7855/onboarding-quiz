import { entryPage, mainMenuPage } from "@/helperVarsAndFunctions/pageUrls"
import {useRouter} from "next/navigation"
import globalStyle from "@/styles/Global.module.css"
import { signOut } from "next-auth/react"

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
    return (
        <button className={globalStyle.buttonStyling} onClick={() => signOut({ callbackUrl: entryPage })}>Logout</button>

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