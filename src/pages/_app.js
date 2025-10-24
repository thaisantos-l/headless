import '@/styles/globals.css'
import Head from 'next/head'
import Layout from '@/components/Layout'

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)

  return getLayout(
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
