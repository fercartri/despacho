import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AuthorsPage() {
  const supabase = await createClient();
  const { data: authors } = await supabase.from("authors").select("*").order("name");

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Autores</h1>
        <Link 
          href="/authors/new" 
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          + Nuevo Autor
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {authors?.map((author) => (
          <div key={author.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="font-semibold">{author.name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}