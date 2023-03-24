/* eslint-disable react/jsx-props-no-spreading */
import '../styles/tailwind.css'
import '../styles/terminal.css'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import Page from '../components/layouts/Page'

const client = new QueryClient({});

const App = ({ Component, pageProps }: AppProps) => {
  const [mounted, setMounted] = React.useState(false)
  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class">
      <Page>
        <QueryClientProvider client={client}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </Page>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-8VSXZQ5WH9" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8VSXZQ5WH9');
        `}
      </Script>
    </ThemeProvider>
  )
}

export default App
