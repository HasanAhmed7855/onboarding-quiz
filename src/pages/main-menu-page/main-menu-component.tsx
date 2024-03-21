import { LogoutButtonComponent } from "@/components/common/redirection"
import { buildQuizPage, viewExistingQuizzesPage } from "@/helperVarsAndFunctions/pageUrls"
import Link from "next/link"
import { useEffect, useState } from "react"
import globalStyle from "../../styles/Global.module.css"
import style from "../../styles/Mainmenu.module.css"
import { useSession, signIn, signOut } from "next-auth/react"

export default function MainMenuComponent() {
  const { data: session, status } = useSession()
  //const usersName = session?.user?.name

  if (status === "loading") {
    return <p>Hang on there...</p>
  }

  if (status === "authenticated") {
    return (
      <>
        {/*<p>Signed in as {usersName}</p>*/}
        <button onClick={() => signOut()}>Sign out</button>
        <img src="https://cdn.pixabay.com/photo/2017/08/11/19/36/vw-2632486_1280.png" />
      </>
    )
  }

  return (
    <>
      <p>Not signed in.</p>
      <button onClick={() => signIn("github")}>Sign in</button>
    </>
  )

  const [isAdmin, setIsAdmin] = useState<boolean>(false) 

  useEffect(() => {
    setIsAdmin(localStorage.getItem("is_admin") === "true" ? true : false)
  }, [])

  return (
    <div data-testid="MainMenuComponent">
      <h2 className={globalStyle.pageTitle}> Main Menu </h2>
      <div className={style.mainmenuContainer}>
        {isAdmin ? 
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
  