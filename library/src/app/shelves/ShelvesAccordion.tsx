'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ActionButtons from '@/components/ActionButtons'
import { deleteShelf } from '@/app/actions/delete'
import { ShelfIcon } from '@/components/EntityIcons'
import { ChevronDown, Eye } from 'lucide-react'

// Definimos la forma de los datos
type Book = {
  id: string
  title: string
  status: string
  book_authors: { authors: { name: string } | null }[]
}

type Shelf = {
  id: string
  name: string
  books: Book[]
}

export default function ShelvesAccordion({ shelvesList }: { shelvesList: Shelf[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const shelfIdToOpen = sessionStorage.getItem('openShelfId')
    
    if (shelfIdToOpen) {
      // Abrir el acordeón
      setExpanded(prev => ({ ...prev, [shelfIdToOpen]: true }))
      
      // Scroll
      setTimeout(() => {
        const element = document.getElementById(`shelf-${shelfIdToOpen}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)

      // Borrar la memoria para evitar que se abra de nuevo al recargar la página
      sessionStorage.removeItem('openShelfId')
    }
  }, [])

  const toggleShelf = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (!shelvesList || shelvesList.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {shelvesList.map((shelf) => {
        const isExpanded = expanded[shelf.id]
        const sortedBooks = [...shelf.books].sort((a, b) => a.title.localeCompare(b.title))

        return (
          <div key={shelf.id} id={`shelf-${shelf.id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group/shelf transition-all scroll-mt-24">
            
            {/* CABECERA*/}
            <div 
              onClick={() => toggleShelf(shelf.id)}
              className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {/* Info del Módulo */}
              <div className="flex items-center gap-4">
                <ShelfIcon />
                <h2 className="text-xl font-bold text-gray-900">{shelf.name}</h2>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                  {shelf.books.length} {shelf.books.length === 1 ? 'libro' : 'libros'}
                </span>
              </div>

              {/* Botones de acción y Flecha */}
              <div className="flex items-center gap-4">
                <div 
                  className="opacity-0 group-hover/shelf:opacity-100 transition-opacity" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionButtons 
                    id={shelf.id} 
                    editUrl={`/shelves/${shelf.id}/edit`} 
                    deleteAction={deleteShelf}

                    confirmMessage={
                      shelf.books.length > 0
                        ? `¿Seguro que quieres borrar la estantería "${shelf.name}"? Los ${shelf.books.length} libros que contiene quedarán sin ubicación asignada`
                        : `¿Seguro que quieres borrar la estantería "${shelf.name}"?`
                    }
                  />
                </div>
                
                <ChevronDown className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* CONTENIDO DESPLEGABLE (Libros) */}
            {isExpanded && (
              <div className="bg-gray-50/50 border-t border-gray-100">
                {sortedBooks.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {sortedBooks.map((book) => {
                      const authorNames = book.book_authors
                        .map((ba) => ba.authors?.name)
                        .filter(Boolean)
                        .join(', ') || 'Autor desconocido'

                      return (
                        <li key={book.id} className="flex justify-between items-center px-6 py-4 hover:bg-white transition-colors">
                          
                          <div className="flex flex-col min-w-0 pr-4">
                            <span className="font-semibold text-gray-900 truncate">{book.title}</span>
                            <span className="text-sm text-gray-500 truncate mt-0.5">{authorNames}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 flex-shrink-0">
                            {/* Estado del libro */}
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
                    Todavía no hay libros registrados en esta estantería
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