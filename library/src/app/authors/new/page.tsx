'use client'

import { useState, useTransition } from 'react'
import { createAuthor } from './actions'
import Link from 'next/link'
import { X, AlertCircle, Loader2 } from 'lucide-react'

export default function NewAuthorPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createAuthor(formData)
      if (result?.error) {
        setError(result.error)
        // El formulario se mantiene pero limpiaremos o dejaremos el input según prefieras. 
        // Al no recargar la página por completo, el usuario ve el error de inmediato.
      }
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Añadir nuevo autor</h1>
          </div>
          <Link href="/authors" className="text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
            <X className="w-4 h-4" /> Cancelar
          </Link>
        </header>

        {/* AVISO DE ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm shadow-sm animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Nombre del autor *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:ring-2 focus:ring-gray-900 focus:outline-none"
              placeholder="Ej: J. K. Rowling"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Guardando...' : 'Guardar nuevo autor'}
          </button>
        </form>

      </div>
    </main>
  )
}