// src/pages/post/[slug].js
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { getPostBySlug } from '@/lib/wp'


function buildSeoFromYoast(yh = {}, fallback = {}) {
  const robots = yh.robots || {}
  const img = yh?.og_image?.[0]?.url || fallback.image
  const robotsContent = [
    robots.index === false ? 'noindex' : 'index',
    robots.follow === false ? 'nofollow' : 'follow',
    robots['max-snippet'] != null ? `max-snippet:${robots['max-snippet']}` : null,
    robots['max-image-preview'] ? `max-image-preview:${robots['max-image-preview']}` : null,
    robots['max-video-preview'] != null ? `max-video-preview:${robots['max-video-preview']}` : null,
  ].filter(Boolean).join(',')

  return {
    title: yh.title || fallback.title,
    description: yh.description || fallback.description,
    canonical: yh.canonical || null,
    robotsContent: robotsContent || null,
    og: {
      title: yh.og_title || yh.title || fallback.title,
      description: yh.og_description || yh.description || fallback.description,
      image: img || null,
      type: yh.og_type || 'article',
    },
    twitter: { card: yh.twitter_card || 'summary_large_image' },
    schema: yh.schema || null,
  }
}

export default function PostPage({ post }) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <main className="py-16">
        <article className="prose prose-invert max-w-none">
          <h1>Carregando…</h1>
        </article>
      </main>
    )
  }

  if (!post) return null

  const title = post?.title?.rendered || 'Sem título'
  const desc = (post?.excerpt?.rendered || '').replace(/<[^>]+>/g, '').slice(0, 155)

  // featured pelo _embedded
  const featured = post?._embedded?.['wp:featuredmedia']?.[0] || null
  const imgEmbedded = featured?.source_url || null
  const altEmbedded = featured?.alt_text || title


  const yh = post?.yoast_head_json || {}
  const imgYoast = yh?.og_image?.[0]?.url || null

 
  const heroImg = imgEmbedded || imgYoast
  const heroAlt = altEmbedded || title

  const termGroups = Array.isArray(post?._embedded?.['wp:term']) ? post._embedded['wp:term'] : []
  const cats = termGroups.flat().filter(t => t?.taxonomy === 'category').map(t => t?.name).filter(Boolean)

  const dateSafe = (() => {
    try { return new Date(post?.date).toLocaleDateString('pt-BR') } catch { return '' }
  })()

 
  const seo = buildSeoFromYoast(yh, { title, description: desc, image: heroImg })

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        {seo.description && <meta name="description" content={seo.description} />}
        {seo.canonical && <link rel="canonical" href={seo.canonical} />}
        {seo.robotsContent && <meta name="robots" content={seo.robotsContent} />}
      
        {seo.og?.title && <meta property="og:title" content={seo.og.title} />}
        {seo.og?.description && <meta property="og:description" content={seo.og.description} />}
        {seo.og?.image && <meta property="og:image" content={seo.og.image} />}
        {seo.og?.type && <meta property="og:type" content={seo.og.type} />}
       
        {seo.twitter?.card && <meta name="twitter:card" content={seo.twitter.card} />}
       
        {seo.schema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema) }} />
        )}
      </Head>

      <article className="post-content prose prose-invert max-w-none leading-relaxed prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-sky-400 hover:prose-a:text-sky-300 prose-a:no-underline prose-strong:text-gray-100 prose-em:text-gray-200 prose-li:marker:text-gray-400 prose-img:rounded-2xl prose-blockquote:border-l-sky-500">

        {/* HERO */}
        {heroImg && (
          <div className="mt-8 relative w-full h-64 md:h-72 lg:h-80 overflow-hidden rounded-[16px]">
            <Image   src={heroImg}   alt={heroAlt} fill   sizes="100vw"  className="object-cover"  priority />
          </div>
        )}

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">{title}</h1>

        {dateSafe && <div className="text-base/7 font-semibold text-indigo-400">Publicado em {dateSafe}</div>}

        {cats.length > 0 && (
          <p className="inline-flex w-fit items-center rounded-full bg-gray-800/60 px-3 py-1.5 text-sm font-medium text-gray-300">
            {cats.join(', ')}
          </p>
        )}

        <div className="mt-6" dangerouslySetInnerHTML={{ __html: post?.content?.rendered || '' }} />
      </article>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' } 
}

export async function getStaticProps({ params }) {
  try {
    const slug = String(params?.slug || '').trim()
    if (!slug) return { notFound: true, revalidate: 30 }

    const post = await getPostBySlug(slug)
    if (!post) return { notFound: true, revalidate: 30 }

    return { props: { post }, revalidate: 60 }
  } catch (e) {
    console.error('post/[slug] getStaticProps error:', e)
    return { notFound: true, revalidate: 30 } 
  }
}
