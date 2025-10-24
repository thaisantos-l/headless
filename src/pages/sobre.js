import Head from 'next/head'
import { getPageBySlug } from '@/lib/wp'

export default function Sobre({ page }) {
  if (!page) return <p>Página não encontrada.</p>
  const title = page.title?.rendered || 'Sobre'
  const desc = page.excerpt?.rendered?.replace(/<[^>]+>/g, '')?.slice(0, 155) || 'Sobre nós'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
      </Head>
       <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
               Conheça sobre nós
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">
             {title}
            </h3>
           
            
          </div>
        </div>
      
      </div> 
     <article className="post-content prose prose-invert max-w-none leading-relaxed  prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-sky-400 hover:prose-a:text-sky-300 prose-a:no-underline  prose-strong:text-gray-100  prose-em:text-gray-200  prose-li:marker:text-gray-400 prose-img:rounded-2xl prose-blockquote:border-l-sky-500">
       
        <div dangerouslySetInnerHTML={{ __html: page.content?.rendered || '' }} />
      </article>
    </>
  )
}

export async function getStaticProps() {
  try {
    const page = await getPageBySlug('sobre'); 
    if (!page) return { notFound: true, revalidate: 30 };
    return { props: { page }, revalidate: 60 };
  } catch (e) {
    console.error('sobre getStaticProps error', e);
    return { notFound: true, revalidate: 30 };
  }
}
