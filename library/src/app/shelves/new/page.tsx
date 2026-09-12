import Link from 'next/link'
import { createShelf } from './actions'

export default async function NewShelfPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Añadir Nuevo Módulo</h1>
          <Link href="/shelves" className="text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg transition-colors">✕ Cancelar</Link>
        </header>

        {params?.error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">⚠️ {params.error}</div>}

        <form action={createShelf} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nombre del módulo (Ej: Balda Superior Salón) *</label>
            <input id="name" name="name" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
          </div>
          <button type="submit" className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 font-bold text-lg shadow-md transition-all">Guardar Módulo</button>
        </form>
      </div>
    </main>
  )
}