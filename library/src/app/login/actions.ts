'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  // 1. Iniciamos el cliente seguro de Supabase
  const supabase = await createClient()

  // 2. Extraemos los datos del formulario
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 3. Intentamos hacer login con Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // 4. Si hay error, redirigimos de vuelta con un mensaje
  if (error) {
    redirect('/login?error=Credenciales incorrectas')
  }

  // 5. Si va bien, le decimos a Next.js que recargue los datos y vamos a la home
  revalidatePath('/')
  redirect('/')
}