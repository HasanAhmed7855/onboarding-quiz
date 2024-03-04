import type { AppProps } from "next/app"
import style from "../styles/Global.module.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div  className={style.globalPageCenter}>
      <h1 className={style.appTitle}>Onboarding Quiz Manager</h1>
      <Component {...pageProps} />
    </div>
  )
}
