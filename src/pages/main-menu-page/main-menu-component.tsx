import { LogoutButtonComponent } from "@/components/common/redirection"
import { buildQuizPage, viewExistingQuizzesPage } from "@/helperVarsAndFunctions/pageUrls"
import Link from "next/link"
import globalStyle from "../../styles/Global.module.css"
import style from "../../styles/Mainmenu.module.css"
import { useSession, signIn } from "next-auth/react"

export default function MainMenuComponent() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Gathering information...</p>
  }

  if (status === "authenticated") {
    return (
      <div data-testid="MainMenuComponent">
        <h2 className={globalStyle.pageTitle}> Main Menu </h2>
        <div className={style.mainmenuContainer}>
          {session.user.role === "ADMIN" ? 
            <>
              <Link className={globalStyle.buttonStyling} href={buildQuizPage}> Create new quiz </Link>
              <Link className={globalStyle.buttonStyling} href={viewExistingQuizzesPage}> View existing quizzes </Link>
            </>
            :
            <>
              <Link className={globalStyle.buttonStyling} href={viewExistingQuizzesPage}> View available quizzes </Link>
              {/* NICE TO HAVE: See previously taken quiz scores page */}
            </>
          }
          <LogoutButtonComponent/>
        </div>
      </div>
    )
  }

  return (
    <>
      <p>Not signed in.</p>
      <button onClick={() => signIn("github")}>Sign in</button>
    </>
  )

}
  