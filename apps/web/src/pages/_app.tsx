import '@src/styles/globals.css'
import '@src/styles/nprogress.css'
import React, { useEffect, useState } from 'react'
import { trpc } from '@src/utils/trpc'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import type { AppProps } from 'next/app'
// import { Poppins } from 'next/font/google'
import clsx from 'clsx'
import NProgress from 'nprogress'
import { Header, Footer } from '@src/components/layout'
import LoadingAnimation from '@src/components/loading-animation'

NProgress.configure({ showSpinner: false })

// const poppins = Poppins({
//   style: ['italic', 'normal'],
//   subsets: ['latin'],
//   weight: ['400'],
//   variable: '--font-poppins'
// })

const App = ({ Component, router, pageProps }: AppProps) => {
  const [loadingAnimationIsVisibile, setLoadingAnimationIsVisible] = useState(false);
  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      NProgress.start();
      setLoadingAnimationIsVisible(true);
    });
    router.events.on('routeChangeComplete', () => {
      NProgress.done();
      setLoadingAnimationIsVisible(false);
    });
    router.events.on('routeChangeError', () => {
      NProgress.done();
      setLoadingAnimationIsVisible(false);
    });
  }, []);

  return (
    <ThemeProvider attribute='class' defaultTheme='dark'>
      <div
        className={clsx('flex flex-col w-full min-h-screen scroll-smooth overflow-hidden', {
          'dark:bg-coal': router.pathname !== '/',
        })}
      >
        <Header />
        <LoadingAnimation visible={loadingAnimationIsVisibile} />
        <div className="mt-[3rem]" />
        <Component {...pageProps} />
        <Footer />
      </div>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-8VSXZQ5WH9" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive" defer>
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

export default trpc.withTRPC(App);
