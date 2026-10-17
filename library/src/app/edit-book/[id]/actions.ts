'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateBook(id: string, formData: FormData) {
  const supabase = await createClient()

  // 1. Extraer datos del formulario
  const title = formData.get('title') as string
  const isbn = formData.get('isbn') as string || null
  const yearRaw = formData.get('year')
  const year = yearRaw ? parseInt(yearRaw as string) : null
  const edition = formData.get('edition') as string || null
  const language = formData.get('language') as string || null
  const pagesRaw = formData.get('pages')
  const pages = pagesRaw ? parseInt(pagesRaw as string) : null
  const description = formData.get('description') as string || null
  const status = formData.get('status') as string || 'Disponible'

  const publisher_id = formData.get('publisher_id') as string || null
  const series_id = formData.get('series_id') as string || null
  const posRaw = formData.get('position_in_series')
  const position_in_series = posRaw ? parseInt(posRaw as string) : null
  const module_id = formData.get('module_id') as string || null

  const existingCoverUrl = formData.get('existing_cover_url') as string || null
  let cover_url = existingCoverUrl

  // 2. Comprobar si se ha subido una NUEVA portada
  const coverFile = formData.get('cover') as File
  if (coverFile && coverFile.size > 0) {
    // Si ya existía una portada anterior, la eliminamos de Storage
    if (existingCoverUrl) {
      const oldFileName = existingCoverUrl.split('/').pop()?.split('?')[0]
      if (oldFileName) {
        await supabase.storage.from('covers').remove([oldFileName])
      }
    }

    // Subir la nueva portada
    const fileExtension = coverFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`

    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(fileName, coverFile)

    if (!uploadError) {
      const { data } = supabase.storage.from('covers').getPublicUrl(fileName)
      cover_url = data.publicUrl
    } else {
      console.error("Error subiendo la nueva imagen:", uploadError)
    }
  }

  // 3. Actualizar la tabla principal 'books'
  const { error: bookError } = await supabase
    .from('books')
    .update({
      title, isbn, year, edition, language, pages, description, status,
      publisher_id, series_id, position_in_series, module_id, cover_url
    })
    .eq('id', id)

  if (bookError) {
    redirect(`/edit-book/${id}?error=Error al actualizar el libro: ${bookError.message}`)
  }

  // 4. Actualizar Autores (Borramos los antiguos e insertamos los nuevos)
  const authorIds: string[] = JSON.parse(formData.get('authorIds') as string || '[]')
  await supabase.from('book_authors').delete().eq('book_id', id)
  if (authorIds.length > 0) {
    const authorsToInsert = authorIds.map(author_id => ({ book_id: id, author_id }))
    await supabase.from('book_authors').insert(authorsToInsert)
  }

  // 5. Actualizar Géneros (Borramos los antiguos e insertamos los nuevos)
  const genreIds: string[] = JSON.parse(formData.get('genreIds') as string || '[]')
  await supabase.from('book_genres').delete().eq('book_id', id)
  if (genreIds.length > 0) {
    const genresToInsert = genreIds.map(genre_id => ({ book_id: id, genre_id }))
    await supabase.from('book_genres').insert(genresToInsert)
  }

  // 6. Refrescar cachés y redirigir
  revalidatePath('/books')
  revalidatePath('/')
  revalidatePath('/shelves')
  revalidatePath('/series')
  redirect('/books')
}