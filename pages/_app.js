import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import Head from 'next/head';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import axios from 'axios';
import Script from 'next/script';
import * as gtag from '@/lib/gtag';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <meta charSet='UTF-8' />
        <title></title>
        <meta name='description' content='' />
        <meta name='keywords' content=' ' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', ${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>

      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            fontFamily: '"Source Sans Pro", sans-serif',
          }}
        >
          <ModalsProvider>
            <SWRConfig
              value={{ fetcher: (url) => axios(url).then((r) => r.data) }}
            >
              <Component {...pageProps} />
            </SWRConfig>
          </ModalsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
