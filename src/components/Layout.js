// src/components/Layout.js
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Contato', href: '/contato' },
]

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const inputRef = useRef(null)
  const router = useRouter()


  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])


  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const onSubmit = (e) => {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    setOpen(false)
    router.push({ pathname: '/buscas', query: { q: term } })
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-[960px] items-center justify-between px-4 py-3"
        >
       
          <div className="flex flex-1">
            <Link href="/" className="font-bold text-white">
              Headless Blog
            </Link>
          </div>

        
          <div className="hidden items-center gap-x-4 lg:flex">
            <nav className="flex items-center gap-x-6 font-semibold">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="text-white hover:text-gray-200">
                  {item.name}
                </Link>
              ))}
            </nav>

      
            <button
              type="button"
              aria-label={open ? 'Fechar busca' : 'Abrir busca'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="rounded-full p-2 text-white hover:bg-gray-800"
            >
              {open ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5" />
              )}
            </button>
          </div>

       
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-gray-800"
            >
              <span className="sr-only">Abrir menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>

      
        <div
          className={[
            'overflow-hidden transition-[max-height,opacity] duration-200',
            open ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
        >
          <form onSubmit={onSubmit} className="mx-auto max-w-[960px] px-4 pb-3">
            <div className="relative">
              <input
                ref={inputRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busque por título ou conteúdo…"
                className="w-full rounded-xl bg-gray-800 px-4 py-3 pr-12 text-white outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-2 my-auto rounded-md px-3 py-2 text-white hover:bg-gray-700"
                aria-label="Buscar"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

       
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/30" aria-hidden="true" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-gray-900 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="font-bold" onClick={() => setMobileMenuOpen(false)}>
                Headless Blog
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2.5 hover:bg-gray-800"
              >
                <span className="sr-only">Fechar menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

       
            <form
              onSubmit={(e) => {
                onSubmit(e)
                setMobileMenuOpen(false)
              }}
              className="mt-6"
            >
              <div className="relative">
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar…"
                  className="w-full rounded-xl bg-gray-800 px-4 py-3 pr-12 text-white outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-2 my-auto rounded-md px-3 py-2 hover:bg-gray-700"
                  aria-label="Buscar"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>

            <div className="mt-6 divide-y divide-gray-800">
              <div className="space-y-2 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-gray-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

   
      <main className="mx-auto max-w-[960px] px-4 py-24">{children}</main>
    </div>
  )
}
