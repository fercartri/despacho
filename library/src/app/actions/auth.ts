'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  
  // Cerrar sesión y borrar cookies
  await supabase.auth.signOut()
  
  redirect('/login')
}