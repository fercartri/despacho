'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  
  // Esto destruye la sesión en Supabase y borra las cookies de tu navegador
  await supabase.auth.signOut()
  
  // Te manda de vuelta al login
  redirect('/login')
}