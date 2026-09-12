import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

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
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* Solo mostramos el menú si hay un usuario logueado */}
        {user && (
          <nav className="bg-gray-900 text-white shadow-md">
            <div className="max-w-6xl mx-auto px-8 py-4 flex gap-6 items-center">
              <Link href="/" className="font-bold text-lg hover:text-gray-300 transition">
                Biblioteca
              </Link>
              <div className="flex gap-4 ml-8">
                <Link href="/books" className="text-sm font-medium hover:text-gray-300 transition">Libros</Link>
                <Link href="/authors" className="text-sm font-medium hover:text-gray-300 transition">Autores</Link>
                <Link href="/publishers" className="text-sm font-medium hover:text-gray-300 transition">Editoriales</Link>
                <Link href="/genres" className="text-sm font-medium hover:text-gray-300 transition">Géneros</Link>
                <Link href="/series" className="text-sm font-medium hover:text-gray-300 transition">Sagas</Link>
                <Link href="/shelves" className="text-sm font-medium hover:text-gray-300 transition">Estanterías</Link>
              </div>
            </div>
          </nav>
        )}
        
        {/* Aquí es donde Next.js inyecta el contenido de cada página */}
        {children}
      </body>
    </html>
  );
}