import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import PublishersAccordion from "./PublishersAccordion";
import { Plus } from "lucide-react";

export default async function PublishersPage() {
  const supabase = await createClient();
  
  // Traemos las editoriales y los libros asociados a cada una (con sus autores)
  const { data: publishers } = await supabase
    .from("publishers")
    .select(`id, name, books (id, title, status, book_authors (authors (name)))`)
    .order("name");

  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Editoriales</h1>
          <Link href="/publishers/new" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Nueva editorial
          </Link>
        </header>

        <PublishersAccordion publishersList={(publishers as unknown as any[]) || []} />

        {publishers?.length === 0 && (
          <div className="text-center bg-white rounded-lg border border-gray-200 p-12 mt-4 shadow-sm">
            <p className="text-gray-500">Todavía no hay editoriales registradas</p>
          </div>
        )}
      </div>
    </main>
  );
}