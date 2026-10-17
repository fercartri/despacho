'use client'

import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import MultiSelect from '@/components/MultiSelect'
import SingleSelect from '@/components/SingleSelect'
import { updateBook } from './actions'
import { Check, X } from 'lucide-react'

type Option = { id: string, name: string }

type FullBook = {
  id: string
  title: string
  isbn: string | null
  year: number | null
  edition: string | null
  language: string | null
  pages: number | null
  description: string | null
  cover_url: string | null
  status: string
  publisher_id: string | null
  series_id: string | null
  position_in_series: number | null
  module_id: string | null
  book_authors: { author_id: string }[]
  book_genres: { genre_id: string }[]
}

type Props = {
  book: FullBook
  authors: Option[]
  genres: Option[]
  publishers: Option[]
  series: Option[]
  shelves: Option[]
}

export default function EditBookForm({ book, authors, genres, publishers, series, shelves }: Props) {
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(
    book.book_authors.map(ba => ba.author_id)
  )
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    book.book_genres.map(bg => bg.genre_id)
  )
  
  const initialSeries = series.find(s => s.id === book.series_id) || null
  const [selectedSeries, setSelectedSeries] = useState<Option | null>(initialSeries)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const coverFile = formData.get('cover') as File

    // Comprimir nueva portada si el usuario la ha seleccionado
    if (coverFile && coverFile.size > 0) {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1200,
        useWebWorker: true
      }

      try {
        const compressedFile = await imageCompression(coverFile, options)
        formData.set('cover', compressedFile, compressedFile.name)
      } catch (error) {
        console.error("Error al comprimir la nueva portada:", error)
      }
    }

    await updateBook(book.id, formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <input type="hidden" name="authorIds" value={JSON.stringify(selectedAuthors)} />
      <input type="hidden" name="genreIds" value={JSON.stringify(selectedGenres)} />
      <input type="hidden" name="existing_cover_url" value={book.cover_url || ''} />

      {/* BLOQUE 1: Información principal */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Información principal</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Título *</label>
          <input 
            id="title" 
            name="title" 
            type="text" 
            defaultValue={book.title} 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cover">
            Portada
          </label>
          {book.cover_url && (
            <div className="mb-3 flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
              <img src={book.cover_url} alt="Portada actual" className="w-12 h-16 object-cover rounded shadow-sm" />
              <span className="text-xs text-gray-500">Portada actual. Sube una nueva imagen para reemplazarla</span>
            </div>
          )}
          <input 
            id="cover" 
            name="cover" 
            type="file" 
            accept="image/*" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" 
          />
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

      {/* BLOQUE 2: Detalles de edición y publicación */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Edición y publicación</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Editorial</label>
            <SingleSelect name="publisher_id" options={publishers} defaultValue={book.publisher_id || undefined} placeholder="Buscar editorial..." />
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
              defaultValue={book.year || ''}
              placeholder="Ej: 1973"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="isbn">ISBN</label>
            <input id="isbn" name="isbn" type="text" defaultValue={book.isbn || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" placeholder="Ej: 978-8478884452" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="language">Idioma</label>
            <input id="language" name="language" type="text" defaultValue={book.language || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" placeholder="Ej: Español" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pages">Nº páginas</label>
            <input id="pages" name="pages" type="number" min="1" defaultValue={book.pages || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" placeholder="Ej: 256" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="edition">Edición</label>
            <input id="edition" name="edition" type="text" defaultValue={book.edition || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm" placeholder="Ej: 1ª" />
          </div>
        </div>
      </div>

      {/* BLOQUE 3: Clasificación y estado */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Organización</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saga / Colección</label>
            <SingleSelect 
              name="series_id" 
              options={series} 
              defaultValue={book.series_id || undefined}
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
              defaultValue={book.position_in_series || ''}
              placeholder={selectedSeries ? "Ej: 1" : "Selecciona una saga primero"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación (estantería) *</label>
            <SingleSelect 
              name="module_id" 
              options={shelves} 
              defaultValue={book.module_id || undefined}
              placeholder="Buscar módulo..." 
              required={true}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">Estado actual *</label>
            <select id="status" name="status" defaultValue={book.status} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white font-semibold shadow-sm">
              <option value="Disponible">Disponible</option>
              <option value="Prestado">Prestado</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 mt-4" htmlFor="description">Notas</label>
          <textarea id="description" name="description" rows={4} defaultValue={book.description || ''} className="w-full px-3 py-2 border border-gray-300 rounded-md text-black shadow-sm"></textarea>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all ${
          isSubmitting 
            ? 'bg-gray-400 text-white cursor-not-allowed' 
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {isSubmitting ? 'Guardando cambios...' : 'Guardar libro'}
      </button>
    </form>
  )
}