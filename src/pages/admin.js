import { useState } from 'react'

const BASE = (process.env.NEXT_PUBLIC_WP_BASE || 'http://localhost/wordpress').replace(/\/$/, '')

async function uploadMedia(file, token, { alt = '', title = '' } = {}) {
  if (!file) return null
  const form = new FormData()
  form.append('file', file)
  if (title) form.append('title', title || file.name)
  if (alt) form.append('alt_text', alt)

  const r = await fetch(`${BASE}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }, 
    body: form,
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data?.message || 'Falha no upload')
  return data.id
}

export default function Admin() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [token, setToken] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('draft') 
  const [thumb, setThumb] = useState(null)
  const [thumbAlt, setThumbAlt] = useState('')

  const [postId, setPostId] = useState('')
  const [busy, setBusy] = useState(false)

  async function login(e) {
    e.preventDefault()
    setBusy(true)
    try {
      const r = await fetch(`${BASE}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      })
      const data = await r.json()
      if (data?.token) {
        setToken(data.token)
        alert('Login OK')
      } else {
        alert('Falha no login: ' + (data?.message || JSON.stringify(data)))
      }
    } catch (err) {
      alert('Erro de rede: ' + err.message)
    } finally {
      setBusy(false)
    }
  }

  async function createPost(e) {
    e.preventDefault()
    if (!token) return alert('Faça login primeiro.')

    setBusy(true)
    try {
      let mediaId = null
      if (thumb) {
        mediaId = await uploadMedia(thumb, token, { alt: thumbAlt, title: title || thumb?.name })
      }

      const body = {
        title,
        content,
        status, 
      }
      if (mediaId) body.featured_media = mediaId

      const r = await fetch(`${BASE}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.message || 'Erro ao criar post')

      setPostId(String(data.id))
      alert(`Post criado! ID ${data.id} (${data.status})`)
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setBusy(false)
    }
  }

  async function updatePost(e) {
    e.preventDefault()
    if (!token) return alert('Faça login primeiro.')
    if (!postId) return alert('Informe o ID do post para editar.')

    setBusy(true)
    try {
      const body = {
   
      }
      if (title) body.title = title
      if (content) body.content = content
      if (status) body.status = status

      if (thumb) {
        const mediaId = await uploadMedia(thumb, token, { alt: thumbAlt, title: title || thumb?.name })
        if (mediaId) body.featured_media = mediaId
      }

      const r = await fetch(`${BASE}/wp-json/wp/v2/posts/${postId}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.message || 'Erro ao atualizar post')

      alert(`Post ${data.id} atualizado (${data.status})`)
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setBusy(false)
    }
  }

  function logout() {
    setToken('')
  }

  return (
    <main className="container max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Painel publicação</h1>

      {!token ? (
        <form onSubmit={login} className="mb-10 space-y-3">
          <input
            className="w-full rounded bg-gray-800 px-3 py-2"
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            className="w-full rounded bg-gray-800 px-3 py-2"
            placeholder="Senha"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button disabled={busy} className="rounded bg-indigo-600 px-4 py-2 font-semibold disabled:opacity-50">
            {busy ? 'Entrando…' : 'Login'}
          </button>
        </form>
      ) : (
        <>
        <div className="mb-8 flex items-center justify-between">
          <span className="text-green-400">Você está logado ✔</span>
          <button onClick={logout} className="rounded bg-gray-700 px-3 py-1.5">Sair</button>
        </div>
      

   
      <form onSubmit={createPost} className="mb-12 space-y-4">
        <h2 className="text-xl font-semibold">Criar post</h2>

        <label className="block">
          <span className="mb-1 block text-sm text-gray-300">Título</span>
          <input
            className="w-full rounded bg-gray-800 px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do post"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-gray-300">Conteúdo (HTML)</span>
          <textarea
            className="w-full rounded bg-gray-800 px-3 py-2"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="<p>Seu HTML aqui…</p>"
          />
        </label>

        <div className="flex items-center gap-3">
          <label className="block">
            <span className="mb-1 block text-sm text-gray-300">Imagem destacada (thumb)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumb(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
          </label>
          <label className="block flex-1">
            <span className="mb-1 block text-sm text-gray-300">ALT da imagem</span>
            <input
              className="w-full rounded bg-gray-800 px-3 py-2"
              value={thumbAlt}
              onChange={(e) => setThumbAlt(e.target.value)}
              placeholder="Descrição da imagem"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm text-gray-300">Status</span>
          <select
            className="w-full rounded bg-gray-800 px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Rascunho</option>
            <option value="publish">Publicar</option>
            <option value="private">Privado</option>
          </select>
        </label>

        <button disabled={busy} className="rounded bg-emerald-600 px-4 py-2 font-semibold disabled:opacity-50">
          {busy ? 'Enviando…' : 'Criar post'}
        </button>
      </form>

   
      <form onSubmit={updatePost} className="space-y-4">
        <h2 className="text-xl font-semibold">Editar post</h2>

        <label className="block">
          <span className="mb-1 block text-sm text-gray-300">ID do post</span>
          <input
            className="w-full rounded bg-gray-800 px-3 py-2"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            placeholder="Ex.: 42"
          />
        </label>

        <p className="text-gray-400 text-sm">
          Preencha apenas os campos que deseja atualizar (título, conteúdo, status e/ou nova thumb).
        </p>

        <button disabled={busy} className="rounded bg-amber-600 px-4 py-2 font-semibold disabled:opacity-50">
          {busy ? 'Atualizando…' : 'Atualizar post'}
        </button>
      </form>
      </>
      )}
    </main>
  )
}
