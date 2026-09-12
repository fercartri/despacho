'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createBook(formData: FormData) {
  const supabase = await createClient()

  // 1. Extraemos los campos básicos del formulario
  const title = formData.get('title') as string
  const isbn = formData.get('isbn') as string || null
  const year = formData.get('year') ? parseInt(formData.get('year') as string) : null
  const edition = formData.get('edition') as string || null
  const language = formData.get('language') as string || null
  const pages = formData.get('pages') ? parseInt(formData.get('pages') as string) : null
  const description = formData.get('description') as string || null
  const status = formData.get('status') as string || 'Disponible'

  // 2. Extraemos los IDs foráneos (si están vacíos los mandamos como nulos)
  const publisher_id = formData.get('publisher_id') as string || null
  const series_id = formData.get('series_id') as string || null
  const position_in_series = formData.get('position_in_series') ? parseInt(formData.get('position_in_series') as string) : null
  const module_id = formData.get('module_id') as string || null

  let cover_url = null
  const coverFile = formData.get('cover') as File

  // Verificamos si el usuario ha subido un archivo (size > 0)
  if (coverFile && coverFile.size > 0) {
    // Generamos un nombre único para que no se sobreescriban fotos con el mismo nombre
    const fileExtension = coverFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`

    // Subimos la foto al bucket 'covers'
    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(fileName, coverFile)

    if (!uploadError) {
      // Si se subió bien, pedimos la URL pública para guardarla en la base de datos
      const { data } = supabase.storage.from('covers').getPublicUrl(fileName)
      cover_url = data.publicUrl
    } else {
      console.error("Error subiendo imagen:", uploadError)
    }
  }

  // 3. Recuperamos y procesamos los arrays de JSON ocultos
  const authorIds: string[] = JSON.parse(formData.get('authorIds') as string || '[]')
  const genreIds: string[] = JSON.parse(formData.get('genreIds') as string || '[]')

  // PASO A: Insertar el libro en la tabla 'books' y pedir que nos devuelva el registro creado (.select().single())
  const { data: newBook, error: bookError } = await supabase
    .from('books')
    .insert([{
      title, isbn, year, edition, language, pages, description, status,
      publisher_id, series_id, position_in_series, module_id, cover_url
    }])
    .select('id')
    .single()

  if (bookError) redirect(`/new-book?error=Error guardando libro: ${bookError.message}`)

  const bookId = newBook.id

  // PASO B: Insertar las relaciones Múltiples (Autores y Géneros)
  // Creamos arrays de objetos { book_id, author_id } listos para insertar de golpe
  if (authorIds.length > 0) {
    const authorsToInsert = authorIds.map(author_id => ({ book_id: bookId, author_id }))
    await supabase.from('book_authors').insert(authorsToInsert)
  }

  if (genreIds.length > 0) {
    const genresToInsert = genreIds.map(genre_id => ({ book_id: bookId, genre_id }))
    await supabase.from('book_genres').insert(genresToInsert)
  }

  // Refrescamos el caché y volvemos al catálogo
  revalidatePath('/books')
  redirect('/books')
}