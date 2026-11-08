'use client'

import Link from 'next/link'
import { Eye, Plus, BookCopy } from "lucide-react";

type Shelf = {
  id: string
  name: string
  books: any[]
}

// Layout Despacho
export const DESK_LAYOUT = [
  // FILA 1
  { slotName: 'D-1.1', className: 'col-span-2' },
  { slotName: 'D-1.2', className: 'col-span-2' },
  { slotName: 'D-1.3', className: 'row-span-2' },
  { slotName: 'D-1.4', className: 'col-span-2 row-span-2' },
  { slotName: 'D-1.5', className: 'col-span-2' },
  { slotName: 'D-1.6', className: 'col-span-2' },
  { slotName: 'D-1.7', className: 'col-span-2' },

  // FILA 2
  { slotName: 'D-2.1', className: ''},
  { slotName: 'D-2.2', className: 'col-span-3' },
  { slotName: 'D-2.3', className: 'col-span-4' },
  { slotName: 'D-2.4', className: ''},
  { slotName: 'D-2.5', className: 'row-span-2' },

  // FILA 3
  { slotName: 'D-3.1', className: 'row-span-2' },
  { slotName: 'D-3.2', className: 'col-span-2' },
  { slotName: 'D-3.3', className: 'col-span-2' },
  { slotName: 'D-3.4', className: 'col-span-2' },
  { slotName: 'D-3.5', className: 'col-span-2' },
  { slotName: 'D-3.6', className: 'col-span-3' },

  // FILA 4
  { slotName: 'D-4.1', className: 'col-span-2' },
  { slotName: 'D-4.2', className: 'col-span-2 row-span-2' },
  { slotName: 'D-4.3', className: '' },
  { slotName: 'D-4.4', className: 'col-span-2' },
  { slotName: 'D-4.5', className: 'col-span-3' },
  { slotName: 'D-4.6', className: 'col-span-2 row-span-2' },

  // FILA 5
  { slotName: 'D-5.1', className: 'col-span-3' },
  { slotName: 'D-5.2', className: 'col-span-3' },
  { slotName: 'D-5.3', className: 'col-span-3' },
]

// Layout Buhardilla
export const BUHARDILLA_LAYOUT = [
  { slotName: 'B-1.2', className: 'col-start-2 row-start-1' },
  { slotName: 'B-1.3', className: 'col-start-3 row-start-1' },

  { slotName: 'B-2.1', className: 'col-start-1 row-start-2' },
  { slotName: 'B-2.2', className: 'col-start-2 row-start-2' },
  { slotName: 'B-2.3', className: 'col-start-3 row-start-2' },

  { slotName: 'B-3.1', className: 'col-start-1 row-start-3' },
  { slotName: 'B-3.2', className: 'col-start-2 row-start-3' },
  { slotName: 'B-3.3', className: 'col-start-3 row-start-3' },
]

type VisualShelfProps = {
  shelvesList: Shelf[]
  layout?: typeof DESK_LAYOUT
  gridCols?: string 
}

export default function VisualShelf({ 
  shelvesList, 
  layout = DESK_LAYOUT, 
  gridCols = "grid-cols-[repeat(13,5.2rem)]" 
}: VisualShelfProps) {
  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 overflow-x-auto mb-8 flex justify-center max-w-full">
      
      <div className={`bg-gray-900 border-8 border-gray-900 grid ${gridCols} auto-rows-[5.2rem] gap-1.5 p-1.5 shadow-inner rounded-lg inline-grid`}>
        
        {layout.map((cell) => {
          const matchedShelf = shelvesList.find(s => s.name === cell.slotName)
          const isEmpty = matchedShelf ? matchedShelf.books.length === 0 : true
          const bookCount = matchedShelf ? matchedShelf.books.length : 0

          return (
            <div
              key={cell.slotName}
              className={`
                relative flex flex-col items-center justify-center p-2 text-center transition-all duration-200 rounded-md group overflow-hidden
                w-full h-full
                ${matchedShelf 
                  ? 'bg-amber-50 border border-amber-200/80 hover:border-amber-400 hover:bg-amber-100/80 cursor-pointer shadow-sm' 
                  : 'bg-gray-100 border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-200/70 cursor-pointer'} 
                ${cell.className}
              `}
              title={matchedShelf ? `Módulo ${matchedShelf.name}` : `Hueco libre (${cell.slotName}) - Haz clic para crearlo`}
            >
              <span className={`text-[10px] font-mono font-bold absolute top-1.5 left-2 transition-colors ${
                matchedShelf ? 'text-amber-800/60 group-hover:text-amber-900' : 'text-gray-400 group-hover:text-gray-600'
              }`}>
                {cell.slotName}
              </span>

              {matchedShelf ? (
                <>
                  <div className="flex flex-col items-center justify-center gap-1 mt-1">
                    <span className="text-gray-800 group-hover:scale-110 transition-transform">
                      <BookCopy className="w-5 h-5 text-amber-800" />
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors ${
                      isEmpty 
                        ? 'bg-amber-100/80 text-amber-700 border border-amber-200' 
                        : 'bg-amber-200 text-amber-900 font-extrabold border border-amber-300 shadow-sm'
                    }`}>
                      {bookCount} {bookCount === 1 ? 'libro' : 'libros'}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 py-0.5 bg-amber-200 text-[9px] font-semibold text-amber-700 text-center opacity-0 group-hover:opacity-100 transition-opacity border-t border-amber-300 flex items-center gap-1 justify-center">
                    <Eye className="w-4 h-4" />Ver módulo
                  </div>

                  <Link 
                    href="/shelves" 
                    onClick={() => { sessionStorage.setItem('openShelfId', matchedShelf.id) }} 
                    className="absolute inset-0 z-10" 
                  />
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center gap-1 mt-1 text-gray-400 group-hover:text-gray-600 transition-colors">
                    <span className="text-[10px] font-medium tracking-wider uppercase text-gray-400 group-hover:text-gray-700 transition-colors">
                      Disponible
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 py-0.5 bg-gray-200 text-[9px] font-semibold text-gray-700 text-center opacity-0 group-hover:opacity-100 transition-opacity border-t border-gray-300 flex items-center gap-1 justify-center">
                    <Plus className="w-4 h-4" />Crear módulo
                  </div>

                  <Link 
                    href={`/shelves/new?name=${cell.slotName}`} 
                    className="absolute inset-0 z-10" 
                  />
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}