'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteBook(id: string) {
  const supabase = await createClient()

  // 1. BUSCAR LA FOTO: Primero pedimos el libro para ver si tiene URL de portada
  const { data: book } = await supabase
    .from('books')
    .select('cover_url')
    .eq('id', id)
    .single()

  // 2. BORRAR LA FOTO: Si tiene foto, la eliminamos de Supabase Storage
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

  // 3. BORRAR EL LIBRO: Ahora sí, eliminamos el registro de la base de datos
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error borrando el libro:", error)
    throw new Error('No se pudo borrar el libro')
  }

  // 4. REFRESCA LAS VISTAS
  revalidatePath('/books') // Refresca el catálogo
  revalidatePath('/')      // Refresca el Dashboard de la página principal
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