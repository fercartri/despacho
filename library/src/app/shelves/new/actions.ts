'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createShelf(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name')?.toString().trim()

  if (!name) {
    return { error: 'El nombre es obligatorio' }
  }

  // Verificamos si ya existe (o dejamos que la constraint UNIQUE de Supabase lance error)
  const { error } = await supabase
    .from('shelf_modules')
    .insert([{ name }])

  if (error) {
    // Si el código de error es de duplicado en PostgreSQL (23505) o similar
    if (error.code === '23505' || error.message.includes('duplicate')) {
      return { error: 'Este módulo ya existe en la base de datos' }
    }
    return { error: error.message }
  }

  // Si todo va bien, redirigimos al listado de módulos
  redirect('/shelves')
}