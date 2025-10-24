import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { searchPosts } from '@/lib/wp'
import Image from 'next/image';


export default function Buscar({ q, posts, page, totalPages }) {
  const router = useRouter()
  const [term, setTerm] = useState(q)

  const onSubmit = (e) => {
    e.preventDefault()
    const q2 = (term || '').trim()
    router.push({ pathname: '/buscas', query: q2 ? { q: q2 } : {} })
  }

  return (
    <>
      <Head><title>Buscar: {q || ''}</title></Head>

  
      <form onSubmit={onSubmit} className="mb-8 flex gap-2">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full rounded-md bg-gray-800 px-4 py-3 text-white outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-indigo-500"
          placeholder="Busque por título ou conteúdo…"
        />
        <button className="rounded-md bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-500">
          Buscar
        </button>
      </form>

      {q ? (
        <>
          <p className="mb-6 text-gray-400">Resultados para: <strong>{q}</strong></p>

          
          <section className="flex flex-col gap-12">
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
                <article key={post.id} className="flex max-w-none flex-col items-start justify-between">
                  <Link href={`/post/${slug}`}>
                   
                    <div className="mt-2 w-full justify-self-stretch overflow-hidden rounded-[16px]">
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

         
          <nav className="mt-10 flex items-center justify-center gap-2">
            <Link
              href={{ pathname: '/buscas', query: { q, page: Math.max(1, page - 1) } }}
              className={`px-3 py-2 rounded-md ${
                page <= 1 ? 'pointer-events-none opacity-40 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              ← Anterior
            </Link>

            <span className="px-3 py-2 text-gray-300">página {page} de {totalPages}</span>

            <Link
              href={{ pathname: '/buscas', query: { q, page: Math.min(totalPages, page + 1) } }}
              className={`px-3 py-2 rounded-md ${
                page >= totalPages ? 'pointer-events-none opacity-40 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Próxima →
            </Link>
          </nav>
        </>
      ) : (
        <p className="text-gray-400">Digite um termo e clique em Buscar.</p>
      )}
    </>
  )
}

export async function getServerSideProps({ query }) {
  try {
    const q = (query.q || '').trim();
    if (!q) return { props: { q: '', posts: [], page: 1, totalPages: 1 } };
    const { posts, totalPages } = await searchPosts({ q, page: 1, perPage: 10 });
    return { props: { q, posts, page: 1, totalPages } };
  } catch (e) {
    console.error('buscar GSSP error', e);
    return { props: { q: query.q || '', posts: [], page: 1, totalPages: 1 } };
  }
}

