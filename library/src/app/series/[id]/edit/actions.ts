'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateSeries(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const supabase = await createClient()

  const { error } = await supabase.from('series').update({ name }).eq('id', id)
  if (error) redirect(`/series/${id}/edit?error=Error al actualizar la saga`)

  revalidatePath('/series')
  revalidatePath('/books') // Refrescamos por si cambió el nombre y afectó a la vista de libros
  redirect('/series')
}