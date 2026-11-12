'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createPublisher(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name')?.toString().trim()

  if (!name) {
    return { error: 'El nombre es obligatorio' }
  }

  // Verificamos si ya existe (o dejamos que la constraint UNIQUE de Supabase lance error)
  const { error } = await supabase
    .from('publishers')
    .insert([{ name }])

  if (error) {
    // Si el código de error es de duplicado en PostgreSQL (23505) o similar
    if (error.code === '23505' || error.message.includes('duplicate')) {
      return { error: 'Esta editorial ya existe en la base de datos' }
    }
    return { error: error.message }
  }

  // Si todo va bien, redirigimos al listado de editoriales
  redirect('/publishers')
}