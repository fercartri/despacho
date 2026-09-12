'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createShelf(formData: FormData) {
  const name = formData.get('name') as string
  const supabase = await createClient()

  const { error } = await supabase.from('shelf_modules').insert([{ name }])
  
  if (error) redirect('/shelves/new?error=Error al crear el módulo')

  revalidatePath('/shelves')
  redirect('/shelves')
}