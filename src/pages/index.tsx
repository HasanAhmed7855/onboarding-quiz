import { mainMenuPage } from "@/helperVarsAndFunctions/pageUrls"
import Head from "next/head"
import Link from "next/link"
import globalStyle from "../styles/Global.module.css"
import style from "../styles/EntryPage.module.css"
import { signIn } from "next-auth/react"

export default function Home() {

  return (
    <>
      <Head>
        <title>Onboarding Quiz Manager</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className={style.entryPageButtonContainer} data-testid="EntryComponent">
          <button className={globalStyle.buttonStyling}
          onClick={() => signIn(undefined, { callbackUrl: mainMenuPage })}
          data-testid="GitHubLoginButton">
            Login using GitHub
          </button>
          <i>If you don't have a GitHub account, you can signup for one via the <b>Login using GitHub</b> button above.</i>
        </div>
      </main>
    </>
  )
}
