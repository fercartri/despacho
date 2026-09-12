'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Recibimos el ID por parámetro y los datos del formulario
export async function updateAuthor(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const supabase = await createClient()

  // Usamos .update() y .eq('id', id) para modificar solo ese registro
  const { error } = await supabase
    .from('authors')
    .update({ name })
    .eq('id', id)

  if (error) {
    redirect(`/authors/${id}/edit?error=Error al actualizar el autor`)
  }

  revalidatePath('/authors')
  redirect('/authors')
}