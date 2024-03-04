import { BackButtonComponent } from "@/components/common/redirection"
import { unknownErrorMessage } from "@/helperVarsAndFunctions/commonStrings"
import { entryPage } from "@/helperVarsAndFunctions/pageUrls"
import { MessageResponseData } from "@/types/types"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"
import globalStyle from "../../styles/Global.module.css"
import signInStyle from "../../styles/SignIn.module.css"

export async function verifyRegistration(usernameFormValue: string, passwordFormValue: string, router: AppRouterInstance) {
  try {
    const apiResponse = await fetch('/api/register-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameFormValue, password: passwordFormValue})
    })
    const responseData: MessageResponseData = await apiResponse.json()
    
    if (apiResponse.ok) {
      window.alert(responseData.message)

      // Direct user to index page where thay can register another account or login
      router.push(entryPage)
    }
    else if (apiResponse.status === 400 || apiResponse.status === 409) {
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

async function formSubmitFunction(router: AppRouterInstance, e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  
  const usernameFormValue = (document.getElementById('username') as HTMLInputElement).value
  const passwordFormValue = (document.getElementById('password') as HTMLInputElement).value

  verifyRegistration(usernameFormValue, passwordFormValue, router)
}

export default function RegistrationComponent() {
  const router = useRouter()

  return (
    <div>
      <h2 className={globalStyle.pageTitle}> Registration Page </h2>
      <form className={globalStyle.textAlign} onSubmit={(e) => formSubmitFunction(router, e)}>
        <label className={signInStyle.labelStyling} htmlFor="username">
          Username:
        </label>
        <input className={signInStyle.inputBoxStyling} type="text" id="username" name="username"/>
        <label className={signInStyle.labelStyling} htmlFor="password">
          Password:
        </label>
        <input className={signInStyle.inputBoxStyling} type="password" id="password" name="password" autoComplete="off"/>
        <div className={globalStyle.groupingContainer}>
          <BackButtonComponent/>
          <button className={globalStyle.buttonStyling} type="submit">
            Create Account 
          </button>
        </div>
      </form>
    </div>
  )
}