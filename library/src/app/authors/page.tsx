import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import AuthorsAccordion from "./AuthorsAccordion";
import { Plus } from "lucide-react";

export default async function AuthorsPage() {
  const supabase = await createClient();
  
  // Traemos los autores y sus libros a través de la tabla intermedia book_authors
  const { data: authors } = await supabase
    .from("authors")
    .select(`
      id, 
      name,
      book_authors (
        books (
          id,
          title,
          status,
          position_in_series,
          series (name)
        )
      )
    `)
    .order("name");

  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Autores</h1>
          <Link href="/authors/new" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Nuevo autor
          </Link>
        </header>

        <AuthorsAccordion authorsList={(authors as unknown as any[]) || []} />

        {authors?.length === 0 && (
          <div className="text-center bg-white rounded-lg border border-gray-200 p-12 mt-4 shadow-sm">
            <p className="text-gray-500">Todavía no hay autores registrados</p>
          </div>
        )}
      </div>
    </main>
  );
}