import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function GenresPage() {
  const supabase = await createClient();
  
  const { data: genres } = await supabase
    .from("genres")
    .select("*")
    .order("name");

  return (
    <main className="p-8 max-w-6xl mx-auto min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Géneros Literarios</h1>
        <Link 
          href="/genres/new" 
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium"
        >
          + Nuevo Género
        </Link>
      </header>

      <div className="flex flex-wrap gap-4">
        {genres?.map((genre) => (
          <div key={genre.id} className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 hover:border-gray-300 transition-colors">
            <h2 className="font-semibold text-gray-800">{genre.name}</h2>
          </div>
        ))}
      </div>

      {genres?.length === 0 && (
        <p className="text-center text-gray-500 mt-12">No hay géneros registrados.</p>
      )}
    </main>
  );
}