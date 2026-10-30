'use client'

import { useState, useEffect, useTransition } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ActionButtons from '@/components/ActionButtons'
import { deleteBook } from '@/app/actions/delete'
import { Plus, MapPin, Tag, Library, X, Search, Loader2, SlidersHorizontal, ChevronDown, Check } from 'lucide-react'

export type FullBook = {
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
  position_in_series: number | null
  publishers: { name: string } | null
  series: { name: string } | null
  shelf_modules: { name: string } | null
  book_authors: { authors: { name: string } | null }[]
  book_genres: { genres: { name: string } | null }[]
}

export default function BooksClient({ 
  books, 
  targetBook, 
  initialQuery 
}: { 
  books: FullBook[]; 
  targetBook: FullBook | null;
  initialQuery: string;
}) {
  const [selectedBook, setSelectedBook] = useState<FullBook | null>(null)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  
  // Estado para el panel de filtros desplegable
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Estados de filtros seleccionados (arrays con nombres únicos)
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedSeries, setSelectedSeries] = useState<string[]>([])
  const [selectedModules, setSelectedModules] = useState<string[]>([])

  // Estado para controlar qué desplegable de categoría está abierto dentro del panel
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (targetBook) {
      setSelectedBook(targetBook)
    } else {
      const bookId = searchParams.get('bookId')
      if (bookId) {
        const bookToOpen = books.find(b => b.id === bookId)
        if (bookToOpen) {
          setSelectedBook(bookToOpen)
        }
      }
    }
  }, [searchParams, books, targetBook])

  const closeModal = () => {
    setSelectedBook(null)
    const bookId = searchParams.get('bookId')
    if (bookId) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('bookId')
      router.replace(`/books${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
    }
  }

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id)
    closeModal()
  }

  // Manejador de la barra de búsqueda por título
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set('q', value);
        params.set('page', '1');
      } else {
        params.delete('q');
      }
      router.replace(`/books${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
    });
  }

  // --- OBTENER LISTAS ÚNICAS DE FILTROS A PARTIR DE LOS LIBROS CARGADOS ---
  const allAuthors = Array.from(new Set(books.flatMap(b => b.book_authors.map(ba => ba.authors?.name).filter(Boolean)))) as string[];
  const allPublishers = Array.from(new Set(books.map(b => b.publishers?.name).filter(Boolean))) as string[];
  const allGenres = Array.from(new Set(books.flatMap(b => b.book_genres.map(bg => bg.genres?.name).filter(Boolean)))) as string[];
  const allSeries = Array.from(new Set(books.map(b => b.series?.name).filter(Boolean))) as string[];
  const allModules = Array.from(new Set(books.map(b => b.shelf_modules?.name).filter(Boolean))) as string[];

  // --- LÓGICA DE FILTRADO COMBINADO ---
  const filteredBooks = books.filter(book => {
    // 1. Filtro de búsqueda por título
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const title = (book.title || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!title.includes(query)) return false;
    }

    // 2. Filtro por Autores
    if (selectedAuthors.length > 0) {
      const bookAuthorNames = book.book_authors.map(ba => ba.authors?.name).filter(Boolean);
      const matches = selectedAuthors.some(author => bookAuthorNames.includes(author));
      if (!matches) return false;
    }

    // 3. Filtro por Editoriales
    if (selectedPublishers.length > 0) {
      const pubName = book.publishers?.name;
      if (!pubName || !selectedPublishers.includes(pubName)) return false;
    }

    // 4. Filtro por Géneros
    if (selectedGenres.length > 0) {
      const bookGenreNames = book.book_genres.map(bg => bg.genres?.name).filter(Boolean);
      const matches = selectedGenres.some(genre => bookGenreNames.includes(genre));
      if (!matches) return false;
    }

    // 5. Filtro por Sagas
    if (selectedSeries.length > 0) {
      const seriesName = book.series?.name;
      if (!seriesName || !selectedSeries.includes(seriesName)) return false;
    }

    // 6. Filtro por Módulos
    if (selectedModules.length > 0) {
      const moduleName = book.shelf_modules?.name;
      if (!moduleName || !selectedModules.includes(moduleName)) return false;
    }

    return true;
  });

  // Funciones de selección de checkboxes
  const toggleFilterItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const resetAllFilters = () => {
    setSelectedAuthors([]);
    setSelectedPublishers([]);
    setSelectedGenres([]);
    setSelectedSeries([]);
    setSelectedModules([]);
  };

  const activeFiltersCount = selectedAuthors.length + selectedPublishers.length + selectedGenres.length + selectedSeries.length + selectedModules.length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabecera unificada */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Libros</h1>
        <Link href="/new-book" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Nuevo libro
        </Link>
      </header>

      {/* BARRA DE BÚSQUEDA Y BOTÓN DE FILTROS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por título de libro..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm transition-all text-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                const params = new URLSearchParams(searchParams.toString());
                params.delete('q');
                router.replace(`/books${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Botón para desplegar el panel de filtros */}
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors shadow-sm ${
            activeFiltersCount > 0 
              ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-white text-gray-900 text-xs font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* PANEL DESPLEGABLE DE FILTROS */}
      {isFiltersOpen && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-md transition-all">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Filtrar catálogo</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
              >
                Resetear filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* 1. FILTRO AUTOR */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'author' ? null : 'author')}
                className="w-full flex justify-between items-center px-3.5 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span className="truncate">Autor {selectedAuthors.length > 0 && `(${selectedAuthors.length})`}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {openDropdown === 'author' && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto p-2 space-y-1">
                  {allAuthors.map(author => (
                    <label key={author} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded text-xs cursor-pointer text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedAuthors.includes(author)}
                        onChange={() => toggleFilterItem(selectedAuthors, setSelectedAuthors, author)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-3.5 h-3.5"
                      />
                      <span className="truncate">{author}</span>
                    </label>
                  ))}
                  {allAuthors.length === 0 && <p className="text-xs text-gray-400 p-2 text-center">No hay autores</p>}
                </div>
              )}
            </div>

            {/* 2. FILTRO EDITORIAL */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'publisher' ? null : 'publisher')}
                className="w-full flex justify-between items-center px-3.5 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span className="truncate">Editorial {selectedPublishers.length > 0 && `(${selectedPublishers.length})`}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {openDropdown === 'publisher' && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto p-2 space-y-1">
                  {allPublishers.map(pub => (
                    <label key={pub} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded text-xs cursor-pointer text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedPublishers.includes(pub)}
                        onChange={() => toggleFilterItem(selectedPublishers, setSelectedPublishers, pub)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-3.5 h-3.5"
                      />
                      <span className="truncate">{pub}</span>
                    </label>
                  ))}
                  {allPublishers.length === 0 && <p className="text-xs text-gray-400 p-2 text-center">No hay editoriales</p>}
                </div>
              )}
            </div>

            {/* 3. FILTRO GÉNERO */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'genre' ? null : 'genre')}
                className="w-full flex justify-between items-center px-3.5 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span className="truncate">Género {selectedGenres.length > 0 && `(${selectedGenres.length})`}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {openDropdown === 'genre' && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto p-2 space-y-1">
                  {allGenres.map(genre => (
                    <label key={genre} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded text-xs cursor-pointer text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => toggleFilterItem(selectedGenres, setSelectedGenres, genre)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-3.5 h-3.5"
                      />
                      <span className="truncate">{genre}</span>
                    </label>
                  ))}
                  {allGenres.length === 0 && <p className="text-xs text-gray-400 p-2 text-center">No hay géneros</p>}
                </div>
              )}
            </div>

            {/* 4. FILTRO SAGA */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'series' ? null : 'series')}
                className="w-full flex justify-between items-center px-3.5 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span className="truncate">Saga {selectedSeries.length > 0 && `(${selectedSeries.length})`}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {openDropdown === 'series' && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto p-2 space-y-1">
                  {allSeries.map(series => (
                    <label key={series} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded text-xs cursor-pointer text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedSeries.includes(series)}
                        onChange={() => toggleFilterItem(selectedSeries, setSelectedSeries, series)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-3.5 h-3.5"
                      />
                      <span className="truncate">{series}</span>
                    </label>
                  ))}
                  {allSeries.length === 0 && <p className="text-xs text-gray-400 p-2 text-center">No hay sagas</p>}
                </div>
              )}
            </div>

            {/* 5. FILTRO MÓDULO */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'module' ? null : 'module')}
                className="w-full flex justify-between items-center px-3.5 py-2 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span className="truncate">Módulo {selectedModules.length > 0 && `(${selectedModules.length})`}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {openDropdown === 'module' && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto p-2 space-y-1">
                  {allModules.map(module => (
                    <label key={module} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded text-xs cursor-pointer text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedModules.includes(module)}
                        onChange={() => toggleFilterItem(selectedModules, setSelectedModules, module)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-3.5 h-3.5"
                      />
                      <span className="truncate">{module}</span>
                    </label>
                  ))}
                  {allModules.length === 0 && <p className="text-xs text-gray-400 p-2 text-center">No hay módulos</p>}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* LISTA PRINCIPAL (Grid de tarjetas resumen) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => {
          const authorNames = book.book_authors
            .map(ba => ba.authors?.name)
            .filter(Boolean)
            .join(', ') || 'Autor desconocido'

          return (
            <div 
              key={book.id} 
              onClick={() => setSelectedBook(book)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer flex flex-col group"
            >
              {/* Portada */}
              <div className="h-56 bg-gray-100 flex items-center justify-center text-gray-400 relative border-b border-gray-100">
                {book.cover_url ? (
                  <img src={book.cover_url} alt={`Portada de ${book.title}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 19v-14c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2zm2-14v14h12v-14h-12zm2 2h8v2h-8v-2zm0 4h8v2h-8v-2z"/></svg>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full shadow-sm backdrop-blur-md ${
                    book.status === 'Disponible' ? 'bg-green-100/90 text-green-800 border border-green-200' : 'bg-orange-100/90 text-orange-800 border border-orange-200'
                  }`}>
                    {book.status}
                  </span>
                </div>
              </div>
              
              {/* Información Resumen */}
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">{authorNames}</p>
                
                <div className="mt-auto space-y-2">
                  {book.series?.name && (
                    <p className="text-xs text-indigo-700 font-medium bg-indigo-50 inline-flex items-center gap-1 px-2 py-0.5 rounded-md max-w-full">
                      <Library className="w-4 h-4 flex-shrink-0" /> 
                      <span className="truncate">
                        {book.series.name} {book.position_in_series ? `(#${book.position_in_series})` : ''}
                      </span>
                    </p>
                  )}
                  
                  <div className="flex flex-col gap-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span title="Módulo/Estantería"><MapPin className="w-4 h-4" /></span> 
                      <span className="truncate">{book.shelf_modules?.name || 'Sin asignar'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span title="ISBN"><Tag className="w-4 h-4" /></span> 
                      <span className="font-mono">{book.isbn || 'Sin ISBN'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center bg-white rounded-lg border border-gray-200 p-12 mt-4 shadow-sm">
          <p className="text-gray-500">No se ha encontrado ningún libro con los filtros seleccionados</p>
        </div>
      )}

      {/* EL MODAL (Vista Detalle) */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => closeModal()}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-900 text-gray-500 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Zona Izquierda (Portada) */}
            <div className="w-full md:w-2/5 bg-gray-50 flex flex-col items-center justify-center text-gray-400 p-8 border-r border-gray-100 md:min-h-full">
              {selectedBook.cover_url ? (
                <img 
                  src={selectedBook.cover_url} 
                  alt={`Portada de ${selectedBook.title}`} 
                  className="w-full max-h-[70vh] rounded-md shadow-lg object-contain my-auto" 
                />
              ) : (
                <div className="w-48 h-72 bg-gray-200 rounded-md shadow-inner flex items-center justify-center border border-gray-300 my-auto">
                    <span className="text-sm">Sin portada</span>
                </div>
              )}
            </div>

            {/* Zona Derecha (Detalles Completos) */}
            <div className="p-8 w-full md:w-3/5 relative">
              
              <div className="flex justify-between items-start mb-1 pr-10">
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">{selectedBook.title}</h2>
                <div className="flex-shrink-0">
                  <ActionButtons 
                    id={selectedBook.id} 
                    editUrl={`/edit-book/${selectedBook.id}`} 
                    deleteAction={handleDeleteBook}
                    confirmMessage={`¿Seguro que quieres borrar "${selectedBook.title}"?`}
                  />
                </div>
              </div>
              
              <p className="text-lg text-gray-600 mb-6 font-medium">
                {selectedBook.book_authors.map(ba => ba.authors?.name).join(', ') || 'Autor desconocido'}
              </p>

              <div className="flex gap-2 mb-8 flex-wrap">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                  selectedBook.status === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {selectedBook.status}
                </span>
                {selectedBook.book_genres.map(bg => (
                  <span key={bg.genres?.name} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {bg.genres?.name}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-sm mb-8">
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Módulo</p>
                  <p className="text-gray-900 font-medium">{selectedBook.shelf_modules?.name || 'Sin asignar'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Saga / Colección</p>
                  <p className="text-gray-900 flex items-center gap-1">
                    {selectedBook.series?.name ? (
                      <>
                        <span className="font-medium">{selectedBook.series.name}</span>
                        {selectedBook.position_in_series && (
                          <span className="text-gray-500 text-xs">
                            (Vol. {selectedBook.position_in_series})
                          </span>
                        )}
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Editorial</p>
                  <p className="text-gray-900">{selectedBook.publishers?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Año de edición</p>
                  <p className="text-gray-900">
                    {selectedBook.year || 'Año N/D'} • {selectedBook.edition ? `${selectedBook.edition} edición` : 'Edición N/D'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">Detalles técnicos</p>
                  <p className="text-gray-900">
                    {selectedBook.pages ? `${selectedBook.pages} pág.` : 'Páginas N/D'} • {selectedBook.language || 'Idioma N/D'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">ISBN</p>
                  <p className="text-gray-900 font-mono">{selectedBook.isbn || '-'}</p>
                </div>
              </div>

              {selectedBook.description && (
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-3">Sinopsis / Notas</p>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedBook.description}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}