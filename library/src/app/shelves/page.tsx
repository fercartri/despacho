import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import ShelvesAccordion from "./ShelvesAccordion";
import { Plus } from "lucide-react";

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
    <main className="min-h-screen bg-gray-50 p-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Módulos</h1>
          <Link href="/new-genre" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Nuevo módulo
          </Link>
        </header>

        <ShelvesAccordion shelvesList={(shelves as unknown as any[]) || []} />

        {shelves?.length === 0 && (
          <div className="text-center bg-white rounded-lg border border-gray-200 p-12 mt-4">
            <p className="text-gray-500">Todavía no hay módulos registrados</p>
          </div>
        )}
      </div>
    </main>
  );
}