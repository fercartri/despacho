import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import ActionButtons from '@/components/ActionButtons'
import { deleteGenre } from '@/app/actions/delete'
import { GenreIcon } from '@/components/EntityIcons'
import { Plus } from "lucide-react";

export default async function GenresPage() {
  const supabase = await createClient();
  const { data: genres } = await supabase.from("genres").select("*").order("name");

  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Géneros</h1>
          <Link href="/new-genre" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Nuevo género
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {genres?.map((genre) => (
            <div key={genre.id} className="group bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-lg hover:border-gray-300 transition-all h-full">
              
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <GenreIcon />
                <h2 className="font-semibold text-gray-900 break-words">
                  {genre.name}
                </h2>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-3">
                <ActionButtons 
                  id={genre.id} 
                  editUrl={`/genres/${genre.id}/edit`} 
                  deleteAction={deleteGenre}
                  confirmMessage={`¿Seguro que quieres borrar el género "${genre.name}"?`}
                />
              </div>

            </div>
          ))}
        </div>

        {genres?.length === 0 && (
          <div className="text-center bg-white rounded-lg border border-gray-200 p-12 mt-4">
            <p className="text-gray-500">Todavía no hay géneros registrados</p>
          </div>
        )}
      </div>
    </main>
  );
}