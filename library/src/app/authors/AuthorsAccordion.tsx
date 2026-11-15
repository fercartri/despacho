'use client'

import { useState } from 'react'
import Link from 'next/link'
import ActionButtons from '@/components/ActionButtons'
import { deleteAuthor } from '@/app/actions/delete'
import { AuthorAvatar } from '@/components/EntityIcons'
import { ChevronDown, Eye } from 'lucide-react'
import AlphabetNav from '@/components/AlphabetNav'

type Book = {
  id: string
  title: string
  status: string
  series?: { name: string } | null
  position_in_series?: number | null
}

export type AuthorWithBooks = {
  id: string
  name: string
  book_authors: {
    books: Book | null
  }[]
}

export default function AuthorsAccordion({ authorsList }: { authorsList: AuthorWithBooks[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleAuthor = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (!authorsList || authorsList.length === 0) {
    return null
  }

  // Control para marcar solo la primera vez que aparece una letra
  const seenLetters = new Set<string>()

  return (
    <div className="flex flex-col gap-4">
      {/* Barra del abecedario arriba del todo */}
      <AlphabetNav items={authorsList} />

      {authorsList.map((author) => {
        const isExpanded = expanded[author.id]

        // Normalizamos la primera letra del nombre (ej: "Á" -> "A")
        const normalizedLetter = author.name
          .trim()
          .charAt(0)
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")

        const isFirstOfLetter = !seenLetters.has(normalizedLetter)
        if (isFirstOfLetter) {
          seenLetters.add(normalizedLetter)
        }
        
        // Extraemos los libros válidos de la tabla intermedia y los ordenamos por título
        const books = author.book_authors
          .map(ba => ba.books)
          .filter((b): b is Book => b !== null)
          .sort((a, b) => a.title.localeCompare(b.title))

        return (
          <div 
            key={author.id} 
            // Asignamos el ID ancla solo al primer elemento de cada letra
            id={isFirstOfLetter ? `anchor-letter-${normalizedLetter}` : undefined}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group/author transition-all scroll-mt-24"
          >
            
            {/* CABECERA */}
            <div 
              onClick={() => toggleAuthor(author.id)}
              className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <AuthorAvatar name={author.name} />
                <h2 className="text-xl font-bold text-gray-900">{author.name}</h2>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                  {books.length} {books.length === 1 ? 'libro' : 'libros'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div 
                  className="opacity-0 group-hover/author:opacity-100 transition-opacity" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionButtons 
                    id={author.id} 
                    editUrl={`/authors/${author.id}/edit`} 
                    deleteAction={deleteAuthor}
                    confirmMessage={
                      books.length > 0
                        ? `¿Seguro que quieres borrar al autor "${author.name}"? Se desvinculará de sus ${books.length} libros (los libros no se borrarán).`
                        : `¿Seguro que quieres borrar al autor "${author.name}"?`
                    }
                  />
                </div>
                <ChevronDown className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* CONTENIDO DESPLEGABLE */}
            {isExpanded && (
              <div className="bg-gray-50/50 border-t border-gray-100">
                {books.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {books.map((book) => (
                      <li key={book.id} className="flex justify-between items-center px-6 py-4 hover:bg-white transition-colors">
                        <div className="flex flex-col min-w-0 pr-4">
                          <span className="font-semibold text-gray-900 truncate">{book.title}</span>
                          {book.series?.name && (
                            <span className="text-xs text-indigo-600 font-medium truncate mt-0.5">
                              {book.series.name} {book.position_in_series ? `(#${book.position_in_series})` : ''}
                            </span>
                          )}
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
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    Todavía no hay libros registrados para este autor
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