'use client'

import { useSearchParams } from 'next/navigation'
import { Download } from 'lucide-react'

export default function ExportBooksButton() {
  const searchParams = useSearchParams()

  const handleExport = () => {
    // Tomamos los filtros actuales de la URL de la página
    const currentParams = searchParams.toString()
    
    // Redirigimos/disparamos la descarga apuntando a nuestra API
    window.location.href = `/api/books/export?${currentParams}`
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm text-sm"
      title="Exportar listado filtrado a CSV"
    >
      <Download className="w-4 h-4" />
      Exportar (CSV)
    </button>
  )
}