import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signOut } from '@/app/actions/auth'
import { LogOut } from 'lucide-react'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi Biblioteca",
  description: "Gestor personal de libros",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Comprobamos la sesión directamente en el layout maestro
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        {/* Solo mostramos el menú si hay un usuario logueado */}
        {user && (
          <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              
              {/* ZONA IZQUIERDA: Logo y Menú */}
              <div className="flex items-center gap-8">
                <Link href="/" className="font-bold text-lg hover:text-gray-300 transition flex items-center gap-2">
                  Biblioteca
                </Link>
                
                <div className="hidden md:flex gap-5">
                  <Link href="/books" className="text-sm font-medium text-gray-300 hover:text-white transition">Libros</Link>
                  <Link href="/authors" className="text-sm font-medium text-gray-300 hover:text-white transition">Autores</Link>
                  <Link href="/publishers" className="text-sm font-medium text-gray-300 hover:text-white transition">Editoriales</Link>
                  <Link href="/genres" className="text-sm font-medium text-gray-300 hover:text-white transition">Géneros</Link>
                  <Link href="/series" className="text-sm font-medium text-gray-300 hover:text-white transition">Sagas</Link>
                  <Link href="/shelves" className="text-sm font-medium text-gray-300 hover:text-white transition">Estanterías</Link>
                </div>
              </div>

              {/* ZONA DERECHA: Botón de Cerrar Sesión */}
              <form action={signOut}>
                <button 
                  type="submit" 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-red-300 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </form>

            </div>
          </nav>
        )}       
        
        {/* Aquí es donde Next.js inyecta el contenido de cada página */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}