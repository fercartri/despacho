import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import ShelvesAccordion from "./ShelvesAccordion";

export default async function ShelvesPage() {
  const supabase = await createClient();
  
  // Traemos los módulos y TODOS los libros que hay dentro de cada uno (con sus autores)
  const { data: shelves } = await supabase
    .from("shelf_modules")
    .select(`
      id, 
      name,
      books (
        id,
        title,
        status,
        book_authors (
          authors (name)
        )
      )
    `)
    .order("name");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estanterías y Módulos</h1>
            <p className="text-gray-500 mt-1">Organización física de tu biblioteca.</p>
          </div>
          <Link 
            href="/shelves/new" 
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm"
          >
            + Nuevo Módulo
          </Link>
        </header>

        {/* Inyectamos el componente interactivo con los datos */}
        <ShelvesAccordion shelvesList={shelves || []} />

        {shelves?.length === 0 && (
          <div className="text-center bg-white rounded-xl border border-gray-200 p-12 mt-4">
            <p className="text-gray-500">No hay módulos de estantería registrados.</p>
          </div>
        )}
      </div>
    </main>
  );
}