'use client'

import { useState } from 'react'
import MultiSelect from '@/components/MultiSelect'
import SingleSelect from '@/components/SingleSelect'
import { createBook } from './actions'

type Option = { id: string, name: string }

type Props = {
  authors: Option[]
  genres: Option[]
  publishers: Option[]
  series: Option[]
  shelves: Option[]
}

export default function NewBookForm({ authors, genres, publishers, series, shelves }: Props) {
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedSeries, setSelectedSeries] = useState<Option | null>(null)

  return (
    <form action={createBook} className="flex flex-col gap-8">
      <input type="hidden" name="authorIds" value={JSON.stringify(selectedAuthors)} />
      <input type="hidden" name="genreIds" value={JSON.stringify(selectedGenres)} />

      {/* BLOQUE 1: Información Principal */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Información Principal</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Título del libro *</label>
          <input id="title" name="title" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autores</label>
            <MultiSelect options={authors} selectedIds={selectedAuthors} onChange={setSelectedAuthors} placeholder="Buscar autor..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Géneros</label>
            <MultiSelect options={genres} selectedIds={selectedGenres} onChange={setSelectedGenres} placeholder="Buscar género..." />
          </div>
        </div>
      </div>

      {/* BLOQUE 2: Detalles de Publicación */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Edición y Publicación</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Editorial</label>
            <SingleSelect name="publisher_id" options={publishers} placeholder="Buscar editorial..." />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">Año</label>
            <input 
              id="year" 
              name="year" 
              type="text" 
              inputMode="numeric" 
              pattern="\d{1,4}" 
              maxLength={4} 
              placeholder="Ej: 1998"
              title="Introduce un año válido (ej: 2024)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="isbn">ISBN</label>
            <input id="isbn" name="isbn" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="language">Idioma</label>
            <input id="language" name="language" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pages">Nº Páginas</label>
            <input id="pages" name="pages" type="number" min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edition">Edición (ej: 1ª)</label>
            <input id="edition" name="edition" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" />
          </div>
        </div>
      </div>

      {/* BLOQUE 3: Clasificación y Estado */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Organización</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saga / Colección</label>
            <SingleSelect 
              name="series_id" 
              options={series} 
              placeholder="Buscar saga..." 
              onChange={setSelectedSeries} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="position_in_series">Volumen en la saga</label>
            <input 
              id="position_in_series" 
              name="position_in_series" 
              type="number" 
              min="1"
              disabled={!selectedSeries}
              placeholder={selectedSeries ? "Ej: 1" : "Selecciona una saga primero"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación (Estantería) *</label>
            <SingleSelect 
              name="module_id" 
              options={shelves} 
              placeholder="Buscar módulo (Obligatorio)..." 
              required={true}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">Estado actual *</label>
            <select id="status" name="status" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white font-semibold shadow-sm">
              <option value="Disponible">🟢 Disponible</option>
              <option value="Prestado">🟠 Prestado</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 mt-4" htmlFor="description">Notas</label>
          <textarea id="description" name="description" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm"></textarea>
        </div>
      </div>

      <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 font-bold text-lg shadow-md transition-all">
        Guardar Libro en la Biblioteca
      </button>
    </form>
  )
}