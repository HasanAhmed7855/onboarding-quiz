import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import style from "../styles/Global.module.css"

export default function App({ Component, pageProps: { session, ...pageProps }, }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div  className={style.globalPageCenter}>
        <h1 className={style.appTitle}>Onboarding Quiz Manager</h1>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}
