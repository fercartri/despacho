'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteBook(id: string) {
  const supabase = await createClient()
  await supabase.from('books').delete().eq('id', id)
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