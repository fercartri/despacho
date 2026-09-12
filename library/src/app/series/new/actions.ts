'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createSeries(formData: FormData) {
  const name = formData.get('name') as string
  const supabase = await createClient()

  const { error } = await supabase.from('series').insert([{ name }])
  if (error) redirect('/series/new?error=Error al crear la saga')

  revalidatePath('/series')
  redirect('/series')
}