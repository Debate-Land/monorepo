import '@src/styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import Head from 'next/head'

const poppins = Poppins({
  style: ['italic', 'normal'],
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-poppins'
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={poppins.className}>
      <Component {...pageProps} />
    </div>
  )
}
