'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ActionButtons from '@/components/ActionButtons'
import { deleteBook } from '@/app/actions/delete'

export type FullBook = {
  id: string
  title: string
  isbn: string | null
  year: number | null
  edition: string | null
  language: string | null
  pages: number | null
  description: string | null
  cover_url: string | null
  status: string
  position_in_series: number | null
  publishers: { name: string } | null
  series: { name: string } | null
  shelf_modules: { name: string } | null
  book_authors: { authors: { name: string } | null }[]
  book_genres: { genres: { name: string } | null }[]
}

export default function BooksClient({ books }: { books: FullBook[] }) {
  const [selectedBook, setSelectedBook] = useState<FullBook | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const bookId = searchParams.get('bookId')
    if (bookId) {
      const bookToOpen = books.find(b => b.id === bookId)
      if (bookToOpen) {
        setSelectedBook(bookToOpen)
      }
    }
  }, [searchParams, books])

  const closeModal = () => {
    setSelectedBook(null)
    // Si había un bookId en la URL, la limpiamos (así si recargas la página, no se vuelve a abrir solo)
    if (searchParams.has('bookId')) {
      router.replace('/books', { scroll: false })
    }
  }

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id)
    closeModal()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Libros</h1>
        <Link 
          href="/new-book" 
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm"
        >
          + Nuevo Libro
        </Link>
      </header>

      {/* LISTA PRINCIPAL (Grid de tarjetas resumen) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => {
          const authorNames = book.book_authors
            .map(ba => ba.authors?.name)
            .filter(Boolean)
            .join(', ') || 'Autor desconocido'

          return (
            <div 
              key={book.id} 
              onClick={() => setSelectedBook(book)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer flex flex-col group"
            >
              {/* Portada */}
              <div className="h-56 bg-gray-100 flex items-center justify-center text-gray-400 relative border-b border-gray-100">
                {book.cover_url ? (
                  // Si hay URL, mostramos la imagen ocupando todo el espacio (object-cover)
                  <img src={book.cover_url} alt={`Portada de ${book.title}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  // Si no hay foto, mostramos el icono por defecto
                  <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 19v-14c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2zm2-14v14h12v-14h-12zm2 2h8v2h-8v-2zm0 4h8v2h-8v-2z"/></svg>
                )}
                {/* Etiqueta flotante de estado en la portada */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full shadow-sm backdrop-blur-md ${
                    book.status === 'Disponible' ? 'bg-green-100/90 text-green-800 border border-green-200' : 'bg-orange-100/90 text-orange-800 border border-orange-200'
                  }`}>
                    {book.status}
                  </span>
                </div>
              </div>
              
              {/* Información Resumen */}
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">{authorNames}</p>
                
                <div className="mt-auto space-y-2">
                  {book.series?.name && (
                    <p className="text-xs text-indigo-700 font-medium bg-indigo-50 inline-block px-2 py-0.5 rounded-md line-clamp-1">
                      📚 {book.series.name} {book.position_in_series ? `(#${book.position_in_series})` : ''}
                    </p>
                  )}
                  
                  <div className="flex flex-col gap-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span title="Módulo/Estantería">📍</span> 
                      <span className="truncate">{book.shelf_modules?.name || 'Sin asignar'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span title="ISBN">🏷️</span> 
                      <span className="font-mono">{book.isbn || 'Sin ISBN'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {books.length === 0 && (
        <div className="text-center bg-white rounded-lg border border-gray-200 p-12 mt-4">
          <p className="text-gray-500">No hay libros registrados aún en tu biblioteca.</p>
        </div>
      )}

      {/* EL MODAL (Vista Detalle) */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
            
            {/* Botón de cerrar (X) */}
            <button 
              onClick={() => closeModal()}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-900 text-gray-500 transition-colors z-10"
            >
              ✕
            </button>

            {/* Zona Izquierda (Portada) */}
            <div className="w-full md:w-2/5 bg-gray-50 min-h-[300px] flex flex-col items-center justify-center text-gray-400 p-8 border-r border-gray-100">
              {selectedBook.cover_url ? (
                <img 
                  src={selectedBook.cover_url} 
                  alt={`Portada de ${selectedBook.title}`} 
                  className="w-full max-w-[250px] rounded-md shadow-lg object-contain" 
                />
              ) : (
                 <div className="w-48 h-72 bg-gray-200 rounded-md shadow-inner flex items-center justify-center border border-gray-300">
                    <span className="text-sm">Sin portada</span>
                 </div>
              )}
            </div>

            {/* Zona Derecha (Detalles Completos) */}
            <div className="p-8 w-full md:w-3/5 relative">
              
              <div className="flex justify-between items-start mb-1 pr-10">
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">{selectedBook.title}</h2>
                <div className="flex-shrink-0">
                  <ActionButtons 
                    id={selectedBook.id} 
                    editUrl={`/edit-book/${selectedBook.id}`} 
                    deleteAction={handleDeleteBook}
                    confirmMessage={`¿Seguro que quieres borrar "${selectedBook.title}" de tu biblioteca?`}
                  />
                </div>
              </div>
              
              <p className="text-lg text-gray-600 mb-6 font-medium">
                {selectedBook.book_authors.map(ba => ba.authors?.name).join(', ') || 'Autor desconocido'}
              </p>

              <div className="flex gap-2 mb-8 flex-wrap">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                  selectedBook.status === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {selectedBook.status}
                </span>
                {selectedBook.book_genres.map(bg => (
                  <span key={bg.genres?.name} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {bg.genres?.name}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-sm mb-8">
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Ubicación</p>
                  <p className="text-gray-900 font-medium">{selectedBook.shelf_modules?.name || 'Sin asignar'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Saga / Colección</p>
                  <p className="text-gray-900">
                    {selectedBook.series?.name ? (
                      <span className="text-indigo-600 font-medium">
                        {selectedBook.series.name} <span className="text-gray-500 text-xs">(Vol. {selectedBook.position_in_series || '?'})</span>
                      </span>
                    ) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Editorial</p>
                  <p className="text-gray-900">{selectedBook.publishers?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Año de edición</p>
                  <p className="text-gray-900">{selectedBook.year || '-'} {selectedBook.edition ? `(${selectedBook.edition})` : ''}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Detalles técnicos</p>
                  <p className="text-gray-900">
                    {selectedBook.pages ? `${selectedBook.pages} pág.` : 'Páginas N/D'} • {selectedBook.language || 'Idioma N/D'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">ISBN</p>
                  <p className="text-gray-900 font-mono">{selectedBook.isbn || '-'}</p>
                </div>
              </div>

              {selectedBook.description && (
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-3">Sinopsis / Notas</p>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedBook.description}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}