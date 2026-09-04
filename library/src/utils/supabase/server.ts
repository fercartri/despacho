import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Obtenemos el almacén de cookies de Next.js
  const cookieStore = await cookies()

  // Creamos y devolvemos el cliente de Supabase
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignoramos el error si se intenta modificar una cookie 
            // desde un componente de servidor que ya ha empezado a renderizar
          }
        },
      },
    }
  )
}