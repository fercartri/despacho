'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateGenre(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const supabase = await createClient()

  const { error } = await supabase.from('genres').update({ name }).eq('id', id)

  if (error) redirect(`/genres/${id}/edit?error=Error al actualizar el género`)

  revalidatePath('/genres')
  redirect('/genres')
}