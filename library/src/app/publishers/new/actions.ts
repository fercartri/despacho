'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPublisher(formData: FormData) {
  const name = formData.get('name') as string
  const supabase = await createClient()

  const { error } = await supabase.from('publishers').insert([{ name }])

  if (error) {
    redirect('/publishers/new?error=Error al guardar la editorial')
  }

  // Recargamos la lista de editoriales y volvemos
  revalidatePath('/publishers')
  redirect('/publishers')
}