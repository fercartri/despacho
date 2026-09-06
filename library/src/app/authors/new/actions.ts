'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createAuthor(formData: FormData) {
  const name = formData.get('name') as string
  const supabase = await createClient()

  const { error } = await supabase.from('authors').insert([{ name }])

  if (error) {
    redirect('/authors/new?error=Error al guardar el autor')
  }

  // Recargamos la lista de autores y volvemos
  revalidatePath('/authors')
  redirect('/authors')
}