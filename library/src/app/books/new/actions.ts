'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createBook(formData: FormData) {
  const supabase = await createClient()

  // 1. Extraemos los campos básicos del formulario
  const title = formData.get('title') as string
  const year = formData.get('year') ? parseInt(formData.get('year') as string) : null
  const status = formData.get('status') as string || 'Disponible'

  // 2. Insertamos en la tabla principal de libros
  const { error } = await supabase
    .from('books')
    .insert([{
      title,
      year,
      status
    }])

  // 3. Manejo de errores o éxito
  if (error) {
    console.error("Error al guardar:", error.message)
    redirect('/new-book?error=Error al guardar el libro')
  }

  // 4. Limpiamos la caché de la portada y volvemos al inicio
  revalidatePath('/')
  redirect('/')
}