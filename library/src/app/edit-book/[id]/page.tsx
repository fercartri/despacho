import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EditBookForm from './EditBookForm'
import { ChevronLeft } from 'lucide-react'

export default async function EditBookPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const sParams = await searchParams
  const supabase = await createClient()

  // 1. Descargar el libro actual con sus autores y géneros
  const { data: book } = await supabase
    .from('books')
    .select(`
      *,
      book_authors (author_id),
      book_genres (genre_id)
    `)
    .eq('id', id)
    .single()

  if (!book) {
    notFound()
  }

  // 2. Descargar las opciones para los desplegables
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
            <Link href="/books" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 mb-2 transition-colors">
              <ChevronLeft /> Volver al catálogo
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Editar libro</h1>
            <p className="text-gray-500 mt-1">Modifica los detalles de "{book.title}"</p>
          </div>
        </header>

        {sParams?.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
            ⚠️ {sParams.error}
          </div>
        )}

        <EditBookForm 
          book={book}
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