import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  // Ejecutamos nuestra función de protección
  return await updateSession(request)
}

// Le decimos a Next.js en qué rutas DEBE ejecutar este middleware.
// Esta regla ignora archivos estáticos (imágenes, css, iconos) para no perder rendimiento.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}