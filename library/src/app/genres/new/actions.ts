'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createGenre(formData: FormData) {
  const name = formData.get('name') as string
  const supabase = await createClient()

  const { error } = await supabase.from('genres').insert([{ name }])

  if (error) {
    redirect('/genres/new?error=Error al guardar el género')
  }

  // Recargamos la lista de géneros y volvemos
  revalidatePath('/genres')
  redirect('/genres')
}