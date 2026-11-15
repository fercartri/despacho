'use client'

import { useState } from 'react'
import Link from 'next/link'
import ActionButtons from '@/components/ActionButtons'
import { deleteGenre } from '@/app/actions/delete'
import { GenreIcon } from '@/components/EntityIcons'
import { ChevronDown, Eye } from 'lucide-react'

type Book = {
  id: string
  title: string
  status: string
  book_authors: { authors: { name: string } | null }[]
}

export type GenreWithBooks = {
  id: string
  name: string
  book_genres: {
    books: Book | null
  }[]
}

export default function GenresAccordion({ genresList }: { genresList: GenreWithBooks[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleGenre = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (!genresList || genresList.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {genresList.map((genre) => {
        const isExpanded = expanded[genre.id]
        
        // Extraemos los libros válidos de la tabla intermedia y los ordenamos alfabéticamente por título
        const books = genre.book_genres
          .map(bg => bg.books)
          .filter((b): b is Book => b !== null)
          .sort((a, b) => a.title.localeCompare(b.title))

        return (
          <div key={genre.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group/genre transition-all">
            
            {/* CABECERA */}
            <div 
              onClick={() => toggleGenre(genre.id)}
              className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <GenreIcon />
                <h2 className="text-xl font-bold text-gray-900">{genre.name}</h2>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                  {books.length} {books.length === 1 ? 'libro' : 'libros'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div 
                  className="opacity-0 group-hover/genre:opacity-100 transition-opacity" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionButtons 
                    id={genre.id} 
                    editUrl={`/genres/${genre.id}/edit`} 
                    deleteAction={deleteGenre}
                    confirmMessage={
                      books.length > 0
                        ? `¿Seguro que quieres borrar el género "${genre.name}"? Se desvinculará de sus ${books.length} libros asociados (los libros no se borrarán).`
                        : `¿Seguro que quieres borrar el género "${genre.name}"?`
                    }
                  />
                </div>
                <ChevronDown className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* CONTENIDO DESPLEGABLE (Lista de libros del género) */}
            {isExpanded && (
              <div className="bg-gray-50/50 border-t border-gray-100">
                {books.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {books.map((book) => {
                      const authorNames = book.book_authors
                        ?.map((ba) => ba.authors?.name)
                        .filter(Boolean)
                        .join(', ') || 'Autor desconocido'

                      return (
                        <li key={book.id} className="flex justify-between items-center px-6 py-4 hover:bg-white transition-colors">
                          <div className="flex flex-col min-w-0 pr-4">
                            <span className="font-semibold text-gray-900 truncate">{book.title}</span>
                            <span className="text-sm text-gray-500 truncate mt-0.5">{authorNames}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                              book.status === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {book.status}
                            </span>
                            <Link
                              href={`/books?bookId=${book.id}`}
                              className="p-2 text-gray-900 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                              title="Ver detalles completos del libro"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    Todavía no hay libros registrados con este género
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}