'use client'

import { useState, useRef, useEffect } from 'react'

type Option = {
  id: string
  name: string
}

type Props = {
  options: Option[]           // Todos los datos de la base de datos (ej: todos los autores)
  selectedIds: string[]       // Los IDs que ya hemos seleccionado
  onChange: (ids: string[]) => void // Función para avisar al formulario de los cambios
  placeholder?: string
}

export default function MultiSelect({ options, selectedIds, onChange, placeholder = "Buscar..." }: Props) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Opciones que coinciden con la búsqueda Y que aún NO han sido seleccionadas
  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(search.toLowerCase()) && 
    !selectedIds.includes(opt.id)
  )

  // Los objetos completos de las opciones que ya hemos seleccionado (para pintar las píldoras)
  const selectedOptions = options.filter(opt => selectedIds.includes(opt.id))

  // Cierra el desplegable si hacemos clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (id: string) => {
    onChange([...selectedIds, id])
    setSearch('') // Limpiamos la búsqueda al seleccionar
    setIsOpen(true) // Mantenemos abierto por si quiere elegir otro
  }

  const handleRemove = (idToRemove: string) => {
    onChange(selectedIds.filter(id => id !== idToRemove))
  }

  const clearSearch = () => {
    setSearch('')
    setIsOpen(false)
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      
      {/* 1. Zona de Píldoras Seleccionadas */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map(opt => (
            <span key={opt.id} className="bg-gray-900 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
              {opt.name}
              <button 
                type="button" 
                onClick={() => handleRemove(opt.id)}
                className="hover:text-red-400 focus:outline-none font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 2. Barra de Búsqueda */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedOptions.length === 0 ? placeholder : "Buscar más..."}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-black pr-10"
        />
        {/* Cruz para limpiar la búsqueda si hay texto */}
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
          >
            ×
          </button>
        )}
      </div>

      {/* 3. Menú Desplegable con las opciones filtradas */}
      {isOpen && (search || filteredOptions.length > 0) && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <li 
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-800 border-b border-gray-50 last:border-0"
              >
                {opt.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500 text-sm italic text-center">
              No se encontraron resultados para "{search}"
            </li>
          )}
        </ul>
      )}
    </div>
  )
}