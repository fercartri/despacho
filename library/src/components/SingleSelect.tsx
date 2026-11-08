'use client'

import { useState, useRef, useEffect } from 'react'

type Option = {
  id: string
  name: string
}

type Props = {
  options: Option[]
  name: string
  placeholder?: string
  required?: boolean
  defaultValue?: string
  onChange?: (opt: Option | null) => void
}

export default function SingleSelect({ options, name, placeholder = "Buscar...", required = false, defaultValue, onChange }: Props) {
  const [search, setSearch] = useState('')
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Referencias para el autoscroll de la lista
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (defaultValue) {
      const found = options.find(opt => opt.id === defaultValue)
      if (found) {
        setSelectedOption(found)
      }
    }
  }, [defaultValue, options])

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(search.toLowerCase())
  )

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (opt: Option) => {
    setSelectedOption(opt)
    setSearch('')
    setIsOpen(false)
    setHighlightedIndex(0)
    if (onChange) onChange(opt)
  }

  const handleClear = () => {
    setSelectedOption(null)
    setSearch('')
    if (onChange) onChange(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true)
      e.preventDefault()
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
        handleSelect(filteredOptions[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input type="hidden" name={name} value={selectedOption ? selectedOption.id : ''} />

      {selectedOption ? (
        <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 shadow-sm">
          <span className="truncate font-medium">{selectedOption.name}</span>
          <button 
            type="button" 
            onClick={handleClear}
            className="text-gray-400 hover:text-red-600 font-bold ml-2 focus:outline-none transition-colors"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={search}
            required={required}
            onChange={(e) => {
              setSearch(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-black pr-10 bg-white shadow-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {isOpen && !selectedOption && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => {
              const isHighlighted = index === highlightedIndex
              return (
                <li 
                  key={opt.id}
                  ref={(el) => { itemRefs.current[index] = el }}
                  onClick={() => handleSelect(opt)}
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
            <li className="px-4 py-3 text-gray-500 text-sm italic text-center bg-gray-50">
              No se encontraron resultados
            </li>
          )}
        </ul>
      )}
    </div>
  )
}