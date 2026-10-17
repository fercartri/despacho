import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import NewBookForm from './NewBookForm'
import { X } from 'lucide-react'

export default async function NewBookPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Añadir nuevo libro</h1>
          </div>
          <Link href="/books" className="text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
            <X className="w-4 h-4" /> Cancelar
          </Link>
        </header>

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