'use client'

import Link from 'next/link'

type Shelf = {
  id: string
  name: string
  books: any[]
}

// Aquí está tu mueble "hardcodeado". 
// El "slotName" es el nombre exacto que le tienes que poner al módulo en Supabase para que se enlace.
const HARDCODED_LAYOUT = [
  // FILA 1
  { slotName: '1.1', className: 'col-span-2' },
  { slotName: '1.2', className: 'col-span-2' },
  { slotName: '1.3', className: 'row-span-2' },
  { slotName: '1.4', className: 'col-span-2 row-span-2' },
  { slotName: '1.5', className: 'col-span-2' },
  { slotName: '1.6', className: 'col-span-2' },
  { slotName: '1.7', className: 'col-span-2' },

  // FILA 2
  { slotName: '2.1', className: ''},
  { slotName: '2.2', className: 'col-span-3' },
  { slotName: '2.3', className: 'col-span-4' },
  { slotName: '2.4', className: ''},
  { slotName: '2.5', className: 'row-span-2' },

  // FILA 3
  { slotName: '3.1', className: 'row-span-2' },
  { slotName: '3.2', className: 'col-span-2' },
  { slotName: '3.3', className: 'col-span-2' },
  { slotName: '3.4', className: 'col-span-2' },
  { slotName: '3.5', className: 'col-span-2' },
  { slotName: '3.6', className: 'col-span-3' },

  // FILA 4
  { slotName: '4.1', className: 'col-span-2' },
  { slotName: '4.2', className: 'col-span-2 row-span-2' },
  { slotName: '4.3', className: '' },
  { slotName: '4.4', className: 'col-span-2' },
  { slotName: '4.5', className: 'col-span-3' },
  { slotName: '4.6', className: 'col-span-2 row-span-2' },

  // FILA 5
  { slotName: '5.1', className: 'col-span-3' },
  { slotName: '5.2', className: 'col-span-3' },
  { slotName: '5.3', className: 'col-span-3' },
]

export default function VisualShelf({ shelvesList }: { shelvesList: Shelf[] }) {
  return (
    <div className="w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200 overflow-x-auto mb-8">
      
      {/* Contenedor Grid: 13 columnas exactas */}
      <div className="min-w-[1000px] aspect-[13/5] bg-gray-900 border-8 border-gray-900 grid grid-cols-13 gap-1.5 p-1.5 shadow-inner">
        
        {HARDCODED_LAYOUT.map((cell, index) => {
          // Buscamos si en la base de datos hay un módulo con el MISMO NOMBRE que el slotName
          const matchedShelf = shelvesList.find(s => s.name === cell.slotName)
          const isEmpty = matchedShelf ? matchedShelf.books.length === 0 : true
          const bookCount = matchedShelf ? matchedShelf.books.length : 0

          return (
            <div
              key={cell.slotName}
              className={`
                relative flex flex-col items-center justify-center p-2 text-center transition-all border-2
                ${matchedShelf 
                  ? 'bg-amber-50 border-transparent hover:border-amber-400 group cursor-pointer' 
                  : 'bg-gray-100 border-dashed border-gray-300 hover:bg-gray-200 cursor-pointer'} 
                ${cell.className}
              `}
              title={matchedShelf ? matchedShelf.name : `Hueco vacío (${cell.slotName})`}
            >
              {/* Etiqueta flotante con el nombre del hueco */}
              <span className="text-[10px] font-bold text-gray-400 absolute top-1 left-2">
                {cell.slotName}
              </span>

              {matchedShelf ? (
                <>
                  {/* Hueco enlazado con la BD */}
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">{isEmpty ? '➕' : '📚'}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isEmpty ? 'bg-gray-200 text-gray-500' : 'bg-amber-200 text-amber-800'}`}>
                      {bookCount} {bookCount === 1 ? 'libro' : 'libros'}
                    </span>
                  </div>
                  {/* Hacer clic aquí podría bajar al acordeón de abajo, o abrir detalles */}
                  <Link href={`#shelf-${matchedShelf.id}`} className="absolute inset-0 z-10" />
                </>
              ) : (
                <>
                  {/* Hueco libre (Aún no creado en la BD) */}
                  <div className="flex flex-col items-center justify-center opacity-50">
                    <span className="text-xl mb-1">Libre</span>
                    <span className="text-[9px] uppercase tracking-wider text-gray-500">Libre</span>
                  </div>
                  {/* Enlace para ir a crear el módulo directamente con el nombre pre-rellenado (opcional) */}
                  <Link href={`/shelves/new?name=${cell.slotName}`} className="absolute inset-0 z-10" />
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}