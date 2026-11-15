'use client'

import { useState } from 'react'
import Link from 'next/link'
import ActionButtons from '@/components/ActionButtons'
import { deletePublisher } from '@/app/actions/delete'
import { PublisherIcon } from '@/components/EntityIcons'
import { ChevronDown, Eye } from 'lucide-react'

type Book = {
  id: string
  title: string
  status: string
  book_authors: { authors: { name: string } | null }[]
}

export type PublisherWithBooks = {
  id: string
  name: string
  books: Book[]
}

export default function PublishersAccordion({ publishersList }: { publishersList: PublisherWithBooks[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const togglePublisher = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (!publishersList || publishersList.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {publishersList.map((publisher) => {
        const isExpanded = expanded[publisher.id]
        // Ordenamos alfabéticamente los libros dentro de la editorial
        const sortedBooks = [...publisher.books].sort((a, b) => a.title.localeCompare(b.title))

        return (
          <div key={publisher.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group/publisher transition-all">
            
            {/* CABECERA */}
            <div 
              onClick={() => togglePublisher(publisher.id)}
              className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <PublisherIcon />
                <h2 className="text-xl font-bold text-gray-900">{publisher.name}</h2>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                  {publisher.books.length} {publisher.books.length === 1 ? 'libro' : 'libros'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div 
                  className="opacity-0 group-hover/publisher:opacity-100 transition-opacity" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionButtons 
                    id={publisher.id} 
                    editUrl={`/publishers/${publisher.id}/edit`} 
                    deleteAction={deletePublisher}
                    confirmMessage={
                      publisher.books.length > 0
                        ? `¿Seguro que quieres borrar la editorial "${publisher.name}"? Los ${publisher.books.length} libros asociados quedarán sin editorial asignada.`
                        : `¿Seguro que quieres borrar la editorial "${publisher.name}"?`
                    }
                  />
                </div>
                <ChevronDown className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* CONTENIDO DESPLEGABLE */}
            {isExpanded && (
              <div className="bg-gray-50/50 border-t border-gray-100">
                {sortedBooks.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {sortedBooks.map((book) => {
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
                          
                          <div className="flex items-center gap-4">
                            {/* Estado del libro */}
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                              book.status === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {book.status}
                            </span>
                            
                            <Link 
                              href={`/books?bookId=${book.id}`}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
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
                    Todavía no hay libros registrados en esta editorial
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