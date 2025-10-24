import Head from 'next/head'
import Link from 'next/link'
import { getPostsPage } from '@/lib/wp'
import Image from 'next/image';


export default function PageNum({ posts, page, totalPages }) {
  return (
    <>
      <Head><title>Página {page} | Blog</title></Head>

 
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
        <div className="mx-auto max-w-2xl py-24 sm:py-36">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
              Página {page}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">
              Listagem
            </h3>
          </div>
        </div>
      </div>

   
      <section className="mx-auto w-full max-w-3xl space-y-12 px-4">
        {posts.map((post) => {
          const title = post.title?.rendered || 'Sem título'
          const slug = post.slug
          const excerpt = post.excerpt?.rendered || ''
          const dateISO = post.date
          const date = new Date(post.date).toLocaleDateString('pt-BR')
          const featured = post._embedded?.['wp:featuredmedia']?.[0]
          const img =
            featured?.media_details?.sizes?.large?.source_url ||
            featured?.media_details?.sizes?.medium?.source_url ||
            featured?.source_url || null
          const cats = post._embedded?.['wp:term']?.[0]?.map((t) => t.name) || []

          return (
          <article key={post.id} className="mx-auto w-full max-w-3xl flex flex-col">
        <Link href={`/post/${slug}`}>
          <div className="mt-2 w-full overflow-hidden rounded-[16px]">
            {img && (
              <Image
                className="block w-full h-64 md:h-72 lg:h-80 object-cover rounded-[16px]"
                loading="lazy"
                src={img}
                alt={featured?.alt_text || title}
              />
            )}
          </div>

          <div className="mt-3 flex items-center gap-x-2 text-xs">
            <time dateTime={dateISO} className="text-gray-100">
              Publicado em {date}
            </time>
            {cats.length > 0 && (
              <span className="inline-flex w-fit rounded-full bg-gray-800/60 px-3 py-1.5 font-medium text-gray-300">
                {cats.join(' · ')}
              </span>
            )}
          </div>

          <div className="group relative">
            <h3 className="mt-3 text-lg leading-6 font-semibold text-white group-hover:text-gray-300">
              <span className="absolute inset-0" aria-hidden="true" />
              {title}
            </h3>
            <div
              className="mt-5 line-clamp-3 text-sm leading-6 text-gray-400"
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
          </div>
        </Link>
      </article>
          )
        })}
      </section>

   
      <nav className="mx-auto mt-10 flex w-full max-w-3xl items-center justify-center gap-2 px-4">
        <Link
          href={page > 1 ? (page - 1 === 1 ? '/' : `/pagina/${page - 1}`) : '#'}
          className={`px-3 py-2 rounded-md ${page === 1 ? 'pointer-events-none opacity-40 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
          ← Anterior
        </Link>

        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
          const n = i + 1
          return (
            <Link
              key={n}
              href={n === 1 ? '/' : `/pagina/${n}`}
              className={`px-3 py-2 rounded-md ${n === page ? 'bg-indigo-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              {n}
            </Link>
          )
        })}

        <Link
          href={page < totalPages ? `/pagina/${page + 1}` : '#'}
          className={`px-3 py-2 rounded-md ${page >= totalPages ? 'pointer-events-none opacity-40 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
          Próxima →
        </Link>
      </nav>
    </>
  )
}

export async function getStaticPaths() {

  return { paths: [{ params: { num: '1' } }], fallback: 'blocking' }
}

export async function getStaticProps() {
  try {
    const { posts, totalPages } = await getPostsPage({ page: 1, perPage: 3 });
    return { props: { posts, totalPages }, revalidate: 60 };
  } catch (e) {
    console.error('index getStaticProps error', e);
    return { props: { posts: [], totalPages: 1 }, revalidate: 60 };
  }
}

