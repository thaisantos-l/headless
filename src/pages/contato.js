import Head from 'next/head'
import { useState } from 'react'
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'

export default function Contato() {
  const [sent, setSent] = useState(false)

  function onSubmit(e) {
    e.preventDefault()
    //
    setSent(true)
  }

  return (
    <>
      <Head>
        <title>Contato | Headless Blog</title>
        <meta name="description" content="Fale com a gente" />
      </Head>

   
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 inline-flex rounded-full bg-white/5 px-3 py-1 text-sm text-gray-300 ring-1 ring-white/10">
          Fale conosco
        </p>
        <h1 className="text-balance text-4xl font-semibold text-white sm:text-6xl">
          Entre em contato
        </h1>
        <p className="mt-4 text-gray-400">
          Preencha o formulário e retornamos assim que possível.
        </p>
      </div>

     
      {sent && (
        <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-emerald-500/10 p-4 ring-1 ring-emerald-500/30">
          <div className="flex items-start gap-3 text-emerald-200">
            <CheckCircleIcon className="h-5 w-5 mt-0.5" />
            <div className="grow">
              <p className="font-semibold">Mensagem enviada!</p>
              <p className="text-sm/6">
                Obrigado por entrar em contato. Esta é uma confirmação simulada —
                nenhum dado foi enviado.
              </p>
            </div>
            <button
              onClick={() => setSent(false)}
              className="rounded-md p-1 text-emerald-200/70 hover:bg-emerald-500/10 hover:text-emerald-200"
              aria-label="Fechar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

   
      <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-2xl space-y-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Nome */}
          <div className="sm:col-span-6">
            <label htmlFor="nome" className="block text-sm/6 font-medium text-white">
              Nome
            </label>
            <div className="mt-2">
              <input
                id="nome"
                name="nome"
                type="text"
                required
                placeholder="Seu nome completo"
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

       
          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="voce@email.com"
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

        
          <div className="sm:col-span-3">
            <label htmlFor="telefone" className="block text-sm/6 font-medium text-white">
              Telefone
            </label>
            <div className="mt-2">
              <input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

    
          <div className="sm:col-span-6">
            <label htmlFor="mensagem" className="block text-sm/6 font-medium text-white">
              Mensagem
            </label>
            <div className="mt-2">
              <textarea
                id="mensagem"
                name="mensagem"
                rows={6}
                required
                placeholder="Escreva sua mensagem…"
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-4">
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-sm/6 font-semibold text-white hover:text-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Enviar
          </button>
        </div>
      </form>
    </>
  )
}
