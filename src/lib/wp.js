const WP_BASE = process.env.NEXT_PUBLIC_WP_BASE?.replace(/\/+$/, '')

if (!WP_BASE) {
  console.warn('⚠️ Defina NEXT_PUBLIC_WP_BASE no .env.local ')
}

function toUrl(pathOrUrl) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${WP_BASE}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

export async function wpFetchJson(pathOrUrl, options = {}) {
  const url = toUrl(pathOrUrl)
  const res = await fetch(url, {
    headers: { Accept: 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`WP fetch failed: ${res.status} ${res.statusText} — ${text}`)
  }
  const data = await res.json()
  return { data, res }
}

export async function getPostsPage({ page = 1, perPage = 10 } = {}) {
  const qs = `?per_page=${perPage}&page=${page}&_embed=1`
  const { data, res } = await wpFetchJson(`/wp-json/wp/v2/posts${qs}`, {
    next: { revalidate: 60 },
  })
  const totalPages = Number(res.headers.get('x-wp-totalpages') || 1)
  return { posts: data, totalPages }
}

export async function searchPosts({ q = '', page = 1, perPage = 10 } = {}) {
  const term = encodeURIComponent(q.trim())
  const qs = `?search=${term}&per_page=${perPage}&page=${page}&_embed=1`
  const { data, res } = await wpFetchJson(`/wp-json/wp/v2/posts${qs}`, {
    next: { revalidate: 30 },
  })
  const totalPages = Number(res.headers.get('x-wp-totalpages') || 1)
  return { posts: data, totalPages }
}

export async function getPostBySlug(slug) {
  if (!WP_BASE) throw new Error('Defina NEXT_PUBLIC_WP_BASE no .env.local')

  const url =
    `${WP_BASE}/wp-json/wp/v2/posts` +
    `?slug=${encodeURIComponent(slug)}` +
    `&_embed=wp:featuredmedia,wp:term` +
    `&yoast_head_json=true`

  const { data } = await wpFetchJson(url, { next: { revalidate: 60 } })
  return Array.isArray(data) && data.length ? data[0] : null
}

export async function getPageBySlug(slug) {
  const s = encodeURIComponent(slug)
  const { data } = await wpFetchJson(`/wp-json/wp/v2/pages?slug=${s}&_embed=1`, {
    next: { revalidate: 300 },
  })
  return Array.isArray(data) && data.length ? data[0] : null
}


export async function uploadMedia({ file, token, alt = '' }) {
  const url = `${WP_BASE}/wp-json/wp/v2/media`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    },
    body: file,
  })
  if (!res.ok) throw new Error(`Upload falhou: ${res.status} ${res.statusText}`)
  const media = await res.json()

  if (alt) {
    const resAlt = await fetch(`${WP_BASE}/wp-json/wp/v2/media/${media.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alt_text: alt }),
    })
    if (resAlt.ok) media.alt_text = alt
  }
  return media
}

export async function createPost({ title, content, status = 'draft', token, featured_media }) {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/posts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, status, featured_media }),
  })
  if (!res.ok) throw new Error(`Criar post falhou: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function updatePost({ id, title, content, status, token, featured_media }) {
  const body = {}
  if (title != null) body.title = title
  if (content != null) body.content = content
  if (status != null) body.status = status
  if (featured_media != null) body.featured_media = featured_media

  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/posts/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Atualizar post falhou: ${res.status} ${res.statusText}`)
  return res.json()
}
