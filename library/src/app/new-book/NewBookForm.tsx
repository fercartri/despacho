'use client'

import { useState } from 'react'
import MultiSelect from '@/components/MultiSelect'
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

  return (
    <form action={createBook} className="flex flex-col gap-8">
      {/* TRUCO: Guardamos los arrays como texto JSON oculto para enviarlos en el form */}
      <input type="hidden" name="authorIds" value={JSON.stringify(selectedAuthors)} />
      <input type="hidden" name="genreIds" value={JSON.stringify(selectedGenres)} />

      {/* BLOQUE 1: Información Principal */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Información Principal</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Título del libro *</label>
          <input id="title" name="title" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
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
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="publisher_id">Editorial</label>
            <select id="publisher_id" name="publisher_id" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white">
              <option value="">-- Sin editorial --</option>
              {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">Año</label>
            <input id="year" name="year" type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="isbn">ISBN</label>
            <input id="isbn" name="isbn" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="language">Idioma</label>
            <input id="language" name="language" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pages">Nº Páginas</label>
            <input id="pages" name="pages" type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edition">Edición (ej: 1ª)</label>
            <input id="edition" name="edition" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
          </div>
        </div>
      </div>

      {/* BLOQUE 3: Clasificación y Estado */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Organización</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="series_id">Saga / Colección</label>
            <select id="series_id" name="series_id" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white">
              <option value="">-- Sin saga --</option>
              {series.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="position_in_series">Volumen en la saga</label>
            <input id="position_in_series" name="position_in_series" type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="shelf_module_id">Ubicación (Estantería)</label>
            <select id="shelf_module_id" name="shelf_module_id" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white">
              <option value="">-- Sin asignar --</option>
              {shelves.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">Estado actual *</label>
            <select id="status" name="status" className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white font-semibold">
              <option value="Disponible">🟢 Disponible</option>
              <option value="Prestado">🟠 Prestado</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 mt-4" htmlFor="description">Sinopsis / Notas</label>
          <textarea id="description" name="description" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"></textarea>
        </div>
      </div>

      <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 font-bold text-lg shadow-md transition-all">
        Guardar Libro en la Biblioteca
      </button>
    </form>
  )
}