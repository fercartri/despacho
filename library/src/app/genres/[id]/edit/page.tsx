import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { updateGenre } from './actions'

export default async function EditGenrePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams

  const supabase = await createClient()
  const { data: genre } = await supabase.from('genres').select('*').eq('id', id).single()

  if (!genre) redirect('/genres')

  const updateActionWithId = updateGenre.bind(null, id)

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Editar Género</h1>
          <Link href="/genres" className="text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg transition-colors">✕ Cancelar</Link>
        </header>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">⚠️ {error}</div>}

        <form action={updateActionWithId} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nombre del género *</label>
            <input id="name" name="name" type="text" required defaultValue={genre.name} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900" />
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 font-bold text-lg shadow-md transition-all">Guardar Cambios</button>
        </form>
      </div>
    </main>
  )
}