'use client'

import { useState } from 'react'
import Link from 'next/link'

// Definimos el súper-tipo con toda la información anidada
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
  // Aquí guardaremos el libro al que se le haga clic. Si es null, el modal está cerrado.
  const [selectedBook, setSelectedBook] = useState<FullBook | null>(null)

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Libros</h1>
        
        {/* NUEVO BOTÓN */}
        <Link 
          href="/new-book" 
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium"
        >
          + Nuevo Libro
        </Link>
      </header>

      {/* LISTA PRINCIPAL (Grid de tarjetas resumen) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => {
          // Extraemos los nombres de los autores separados por comas
          const authorNames = book.book_authors
            .map(ba => ba.authors?.name)
            .filter(Boolean)
            .join(', ') || 'Autor desconocido'

          return (
            <div 
              key={book.id} 
              onClick={() => setSelectedBook(book)}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex flex-col"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                {book.cover_url ? <span>Portada</span> : <span>Sin portada</span>}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">{book.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-1">{authorNames}</p>
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    book.status === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {book.status}
                  </span>
                  <span className="text-xs text-gray-400">{book.year}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {books.length === 0 && (
        <p className="text-center text-gray-500 mt-12">No hay libros registrados aún.</p>
      )}

      {/* EL MODAL (Solo se renderiza si selectedBook no es null) */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          {/* Contenedor del Modal */}
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row">
            
            {/* Botón de cerrar (X) */}
            <button 
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 text-gray-800 font-bold z-10"
            >
              ✕
            </button>

            {/* Zona Izquierda (Portada) */}
            <div className="w-full md:w-1/3 bg-gray-100 min-h-[300px] flex items-center justify-center text-gray-400">
              {selectedBook.cover_url ? <span>Portada completa</span> : <span>Sin portada</span>}
            </div>

            {/* Zona Derecha (Todos los detalles) */}
            <div className="p-8 w-full md:w-2/3">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedBook.title}</h2>
              <p className="text-xl text-gray-600 mb-6">
                {selectedBook.book_authors.map(ba => ba.authors?.name).join(', ') || 'Autor desconocido'}
              </p>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Editorial</p>
                  <p className="text-gray-900">{selectedBook.publishers?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Año</p>
                  <p className="text-gray-900">{selectedBook.year || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Saga / Colección</p>
                  <p className="text-gray-900">
                    {selectedBook.series?.name 
                      ? `${selectedBook.series.name} (Vol. ${selectedBook.position_in_series || '?'})` 
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Géneros</p>
                  <p className="text-gray-900">
                    {selectedBook.book_genres.map(bg => bg.genres?.name).join(', ') || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Ubicación</p>
                  <p className="text-gray-900">{selectedBook.shelf_modules?.name || 'Sin asignar'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Páginas / Idioma</p>
                  <p className="text-gray-900">
                    {selectedBook.pages ? `${selectedBook.pages} pág.` : '-'} / {selectedBook.language || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">ISBN</p>
                  <p className="text-gray-900">{selectedBook.isbn || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Estado</p>
                  <p className="text-gray-900 font-semibold">{selectedBook.status}</p>
                </div>
              </div>

              {selectedBook.description && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-gray-500 font-medium mb-2">Sinopsis / Notas</p>
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