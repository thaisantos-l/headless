import Head from 'next/head'
import Link from 'next/link'
import { getPostsPage } from '@/lib/wp'
import PostCard from '@/components/PostCard'
import Hero from '@/components/Hero'


export default function Home({ posts, totalPages }) {
   const page = 1
  return (
    <>
      <Head>
        <title>Blog | Headless </title>
        <meta name="description" content="Lista de posts do WordPress consumidos via REST API" />
      </Head>
        <section>
           <Hero  />
      </section>
      <section className="bg-gray-900 ">
       
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl">Mais vistos</h2>
            </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16   lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
         </div>
        </div>
      </section>
      <nav className="mt-10 flex items-center justify-center gap-2">
        <Link
          href={page > 1 ? `/pagina/${page - 1}` : '#'}
          className={`px-3 py-2 rounded-md ${page === 1 ? 'pointer-events-none opacity-40 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
          ← Anterior
        </Link>
        {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
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
          href={totalPages > 1 ? `/pagina/2` : '#'}
          className={`px-3 py-2 rounded-md ${totalPages <= 1 ? 'pointer-events-none opacity-40 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
          Próxima →
        </Link>
      </nav>
    </>
  )
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

