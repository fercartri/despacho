'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updatePublisher(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const supabase = await createClient()

  const { error } = await supabase.from('publishers').update({ name }).eq('id', id)

  if (error) redirect(`/publishers/${id}/edit?error=Error al actualizar la editorial`)

  revalidatePath('/publishers')
  redirect('/publishers')
}