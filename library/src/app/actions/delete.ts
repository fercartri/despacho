'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteBook(id: string) {
  const supabase = await createClient()

  // Buscar la foto
  const { data: book } = await supabase
    .from('books')
    .select('cover_url')
    .eq('id', id)
    .single()

  // Borrar la foto
  if (book && book.cover_url) {
    const fileName = book.cover_url.split('/').pop()
    
    if (fileName) {
      const { error: storageError } = await supabase.storage
        .from('covers')
        .remove([fileName])
        
      if (storageError) {
        console.error("❌ Error de Supabase borrando foto:", storageError)
      }
    }
  }

  // Borrar el libro
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error borrando el libro:", error)
    throw new Error('No se pudo borrar el libro')
  }

  // Refrescar
  revalidatePath('/books')
  revalidatePath('/')
}

export async function deleteAuthor(id: string) {
  const supabase = await createClient()
  await supabase.from('authors').delete().eq('id', id)
  revalidatePath('/authors')
}

export async function deletePublisher(id: string) {
  const supabase = await createClient()
  await supabase.from('publishers').delete().eq('id', id)
  revalidatePath('/publishers')
}

export async function deleteGenre(id: string) {
  const supabase = await createClient()
  await supabase.from('genres').delete().eq('id', id)
  revalidatePath('/genres')
}

export async function deleteSeries(id: string) {
  const supabase = await createClient()
  await supabase.from('series').delete().eq('id', id)
  
  revalidatePath('/series')
  revalidatePath('/books')
}

export async function deleteShelf(id: string) {
  const supabase = await createClient()
  await supabase.from('shelf_modules').delete().eq('id', id)
  revalidatePath('/shelves')
  revalidatePath('/books')
}