import { FormEvent } from "react"
import { useRouter } from 'next/navigation'
import { BackButtonComponent } from "@/components/common/redirection"
import { unknownErrorMessage } from "@/helperVarsAndFunctions/commonStrings"
import { mainMenuPage } from "@/helperVarsAndFunctions/pageUrls"
import globalStyle from "../../styles/Global.module.css"
import signInStyle from "../../styles/SignIn.module.css"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

type ReponseData = {
  message: string,
  is_admin?: boolean,
  user_id?: number
}

export async function verifyLogin(usernameFormValue: string, passwordFormValue: string, router: AppRouterInstance) {
  try {
    const apiResponse = await fetch('/api/login-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameFormValue, password: passwordFormValue})
    })
    const responseData: ReponseData = await apiResponse.json()
    
    if (apiResponse.ok) { // apiResponse.ok = successful (returned back status codes 200-299)

      localStorage.setItem("is_admin", String(responseData.is_admin))  // Set permission level in localStorage
      localStorage.setItem("user_id", String(responseData.user_id))

      // Direct user to main-menu page
      router.push(mainMenuPage)
    }
    else if (apiResponse.status === 401 || apiResponse.status === 400) {
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

  verifyLogin(usernameFormValue, passwordFormValue, router)
}


export default function LoginComponent() {
  const router = useRouter()
  
  return (
    <div>
      <h2 className={globalStyle.pageTitle}> Login Page </h2>
      <form className={globalStyle.textAlign} onSubmit={(e) => formSubmitFunction(router, e)}>
        <label className={signInStyle.labelStyling} htmlFor="username">Username:</label>
        <input className={signInStyle.inputBoxStyling} type="text" id="username" name="username"/>
        <label className={signInStyle.labelStyling} htmlFor="password">Password:</label>
        <input className={signInStyle.inputBoxStyling} type="password" id="password" name="password" autoComplete="off"/>
        <div className={globalStyle.groupingContainer}>
          <BackButtonComponent/>
          <button className={globalStyle.buttonStyling} type="submit"> Login </button>
        </div>
      </form>
    </div>
  )
}
