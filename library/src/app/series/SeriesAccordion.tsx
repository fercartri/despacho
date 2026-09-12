'use client'

import { useState } from 'react'
import Link from 'next/link'
import ActionButtons from '@/components/ActionButtons'
import { deleteSeries } from '@/app/actions/delete'

type Book = {
  id: string
  title: string
  status: string
  position_in_series: number | null
}

type Series = {
  id: string
  name: string
  books: Book[]
}

export default function SeriesAccordion({ seriesList }: { seriesList: Series[] }) {
  // Guardamos qué sagas están desplegadas (por ID)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleSeries = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col gap-4">
      {seriesList.map((item) => {
        const isExpanded = expanded[item.id]
        
        // Ordenamos los libros por su posición en la saga (los que no tienen número van al final)
        const sortedBooks = [...item.books].sort((a, b) => {
          const posA = a.position_in_series || 9999
          const posB = b.position_in_series || 9999
          return posA - posB
        })

        return (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group/series transition-all">
            
            {/* CABECERA (Siempre visible) */}
            <div 
              onClick={() => toggleSeries(item.id)}
              className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {/* Info de la Saga */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-lg shadow-sm">
                  📚
                </div>
                <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                  {item.books.length} {item.books.length === 1 ? 'libro' : 'libros'}
                </span>
              </div>

              {/* Botones de acción y Flecha */}
              <div className="flex items-center gap-4">
                {/* Los botones aparecen al pasar el ratón. stopPropagation evita que se despliegue al pulsar editar/borrar */}
                <div 
                  className="opacity-0 group-hover/series:opacity-100 transition-opacity" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionButtons 
                    id={item.id} 
                    editUrl={`/series/${item.id}/edit`} 
                    deleteAction={deleteSeries}
                    confirmMessage={
                      item.books.length > 0 
                        ? `¡PELIGRO CRÍTICO! ¿Seguro que quieres borrar "${item.name}"? Se ELIMINARÁN PARA SIEMPRE los ${item.books.length} libros que contiene.`
                        : `¿Seguro que quieres borrar la saga "${item.name}"?`
                    }
                  />
                </div>
                
                {/* Icono de flecha (gira cuando se abre) */}
                <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </div>
            </div>

            {/* CONTENIDO DESPLEGABLE (Libros) */}
            {isExpanded && (
              <div className="bg-gray-50/50 border-t border-gray-100">
                {sortedBooks.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {sortedBooks.map((book) => (
                      <li key={book.id} className="flex justify-between items-center px-6 py-4 hover:bg-white transition-colors">
                        
                        <div className="flex items-center gap-4">
                          {/* Número de volumen destacado */}
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                            {book.position_in_series || '-'}
                          </span>
                          <span className="font-semibold text-gray-900">{book.title}</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Estado del libro */}
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            book.status === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {book.status}
                          </span>
                          
                          {/* Botón del OJO: Enlazamos al catálogo pasando el ID por la URL */}
                          <Link 
                            href={`/books?bookId=${book.id}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Ver detalles completos del libro"
                          >
                            👁️
                          </Link>
                        </div>

                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-center text-gray-500 italic text-sm">
                    No hay libros registrados en esta saga todavía.
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
      
      {seriesList.length === 0 && (
        <div className="text-center bg-white rounded-xl border border-gray-200 p-12 mt-4">
          <p className="text-gray-500">No hay sagas registradas.</p>
        </div>
      )}
    </div>
  )
}