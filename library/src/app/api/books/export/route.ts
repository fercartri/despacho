import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = await createClient()

  // Extraemos los filtros actuales desde la URL
  const query = searchParams.get('query') || ''
  const status = searchParams.get('status') || ''
  const authorId = searchParams.get('authorId') || ''
  const genreId = searchParams.get('genreId') || ''

  // Construimos la consulta base a Supabase (igual que en tu catálogo)
  let dbQuery = supabase
    .from('books')
    .select(`
      id,
      title,
      year,
      isbn,
      language,
      pages,
      edition,
      status,
      description,
      publishers ( name ),
      series ( name ),
      shelf_modules ( name ),
      book_authors ( authors ( name ) ),
      book_genres ( genres ( name ) )
    `)
    .order('title', { ascending: true })

  // Aplicamos los filtros activos si existen
  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`)
  }
  if (status) {
    dbQuery = dbQuery.eq('status', status)
  }
  if (authorId) {
    dbQuery = dbQuery.eq('book_authors.author_id', authorId)
  }
  if (genreId) {
    dbQuery = dbQuery.eq('book_genres.genre_id', genreId)
  }

  const { data: books, error } = await dbQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Definimos las columnas del CSV
  const headers = [
    'ID',
    'Título',
    'Autores',
    'Géneros',
    'Editorial',
    'Año',
    'ISBN',
    'Idioma',
    'Páginas',
    'Edición',
    'Saga',
    'Módulo Estantería',
    'Estado',
    'Notas'
  ]

  // Convertimos las filas a formato CSV escapando comillas para evitar rupturas de formato
  const csvRows = (books || []).map(book => {
    const authors = book.book_authors
      ?.map((ba: any) => ba.authors?.name)
      .filter(Boolean)
      .join('; ') || ''

    const genres = book.book_genres
      ?.map((bg: any) => bg.genres?.name)
      .filter(Boolean)
      .join('; ') || ''

    const row = [
      book.id,
      book.title,
      authors,
      genres,
      (book.publishers as any)?.name || '',
      book.year || '',
      book.isbn || '',
      book.language || '',
      book.pages || '',
      book.edition || '',
      (book.series as any)?.name || '',
      (book.shelf_modules as any)?.name || '',
      book.status || '',
      book.description || ''
    ]

    // Escapamos comillas dobles internas y envolvemos cada valor entre comillas
    return row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
  })

  // Añadimos el BOM (\uFEFF) al inicio para que Excel detecte correctamente la codificación UTF-8 (tildes, 'ñ', etc.)
  const csvContent = '\uFEFF' + [headers.join(','), ...csvRows].join('\n')

  // Retornamos el contenido indicando descarga de archivo
  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="catalogo_libros_${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}