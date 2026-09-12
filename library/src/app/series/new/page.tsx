import Link from 'next/link'
import { createSeries } from './actions'

export default async function NewSeriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Añadir Nueva Saga</h1>
          <Link href="/series" className="text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg transition-colors">✕ Cancelar</Link>
        </header>

        {params?.error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">⚠️ {params.error}</div>}

        <form action={createSeries} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nombre de la saga / colección *</label>
            <input id="name" name="name" type="text" required placeholder="Ej: Canción de Hielo y Fuego" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900" />
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 font-bold text-lg shadow-md transition-all">Guardar Saga</button>
        </form>
      </div>
    </main>
  )
}