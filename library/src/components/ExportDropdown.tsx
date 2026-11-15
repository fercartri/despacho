'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, FileSpreadsheet, FileText, FileCode } from 'lucide-react'

export default function ExportDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getUrl = (format: string) => `/api/books/export?format=${format}`

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition font-medium shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <Download className="w-4 h-4" /> Exportar
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2 text-sm text-gray-700">
          
          <div className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Formatos disponibles
          </div>
          
          <a
            href={getUrl('xlsx')}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            <span>Excel (.xlsx)</span>
          </a>

          <a
            href={getUrl('csv')}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>CSV (.csv)</span>
          </a>

          <a
            href={getUrl('json')}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <FileCode className="w-4 h-4 text-amber-600" />
            <span>JSON (.json)</span>
          </a>

        </div>
      )}
    </div>
  )
}