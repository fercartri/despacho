import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import NewBookForm from './NewBookForm'

export default async function NewBookPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Descargamos todas las opciones en paralelo usando Promise.all para que no haya cuellos de botella
  const [
    { data: authors },
    { data: genres },
    { data: publishers },
    { data: series },
    { data: shelves }
  ] = await Promise.all([
    supabase.from('authors').select('id, name').order('name'),
    supabase.from('genres').select('id, name').order('name'),
    supabase.from('publishers').select('id, name').order('name'),
    supabase.from('series').select('id, name').order('name'),
    supabase.from('shelf_modules').select('id, name').order('name')
  ])

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Añadir Nuevo Libro</h1>
            <p className="text-gray-500 mt-1">Registra un ejemplar y categorízalo en tu biblioteca.</p>
          </div>
          <Link href="/books" className="text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg transition-colors">
            ✕ Cancelar
          </Link>
        </header>

        {params?.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
            ⚠️ {params.error}
          </div>
        )}

        {/* Pasamos los datos al componente interactivo. Si alguna lista falla y es null, pasamos un array vacío [] */}
        <NewBookForm 
          authors={authors || []}
          genres={genres || []}
          publishers={publishers || []}
          series={series || []}
          shelves={shelves || []}
        />

      </div>
    </main>
  )
}