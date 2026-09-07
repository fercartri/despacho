import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import ActionButtons from '@/components/ActionButtons'
import { deleteAuthor } from '@/app/actions/delete'

export default async function AuthorsPage() {
  const supabase = await createClient();
  
  const { data: authors } = await supabase
    .from("authors")
    .select("*")
    .order("name");

  return (
    <main className="p-8 max-w-6xl mx-auto min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Autores</h1>
        <Link 
          href="/authors/new" 
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium"
        >
          + Nuevo Autor
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {authors?.map((author) => (
          <div key={author.id} className="group bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center relative hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-gray-800">{author.name}</h2>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
              <ActionButtons 
                id={author.id} 
                editUrl={`/authors/${author.id}/edit`} 
                deleteAction={deleteAuthor}
              />
            </div>
          </div>
        ))}
      </div>

      {authors?.length === 0 && (
        <p className="text-center text-gray-500 mt-12">No hay autores registrados.</p>
      )}
    </main>
  );
}