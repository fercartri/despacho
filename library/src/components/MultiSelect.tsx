'use client'

import { useState, useRef, useEffect } from 'react'

type Option = {
  id: string
  name: string
}

type Props = {
  options: Option[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  placeholder?: string
}

export default function MultiSelect({ options, selectedIds, onChange, placeholder = "Buscar..." }: Props) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  
  // Referencias para los elementos de la lista desplegable (para el autoscroll)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(search.toLowerCase()) && 
    !selectedIds.includes(opt.id)
  )

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.id))

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setHighlightedIndex(0)
  }, [search])

  // --- AUTOSCROLL EFECTO ---
  useEffect(() => {
    if (isOpen && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [highlightedIndex, isOpen])

  const handleSelect = (id: string) => {
    onChange([...selectedIds, id])
    setSearch('')
    setIsOpen(true)
  }

  const handleRemove = (idToRemove: string) => {
    onChange(selectedIds.filter(id => id !== idToRemove))
  }

  const clearSearch = () => {
    setSearch('')
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true)
      return
    }

    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex].id)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      
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

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedOptions.length === 0 ? placeholder : "Buscar más..."}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-black pr-10"
        />
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

      {isOpen && (search || filteredOptions.length > 0) && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => {
              const isHighlighted = index === highlightedIndex
              return (
                <li 
                  key={opt.id}
                  ref={(el) => { itemRefs.current[index] = el }}
                  onClick={() => handleSelect(opt.id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${
                    isHighlighted ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {opt.name}
                </li>
              )
            })
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