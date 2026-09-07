import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import ActionButtons from '@/components/ActionButtons'
import { deleteAuthor } from '@/app/actions/delete'

export default async function AuthorsPage() {
  const supabase = await createClient();
  const { data: authors } = await supabase.from("authors").select("*").order("name");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Autores</h1>
          <Link 
            href="/authors/new" 
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm"
          >
            + Nuevo Autor
          </Link>
        </header>

        {/* Cuadrícula idéntica a la de libros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {authors?.map((author) => (
            <div key={author.id} className="group bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-lg hover:border-gray-300 transition-all h-full">
              
              {/* min-w-0 permite que el texto haga salto de línea si es muy largo */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-lg">
                  {author.name.charAt(0).toUpperCase()}
                </div>
                {/* break-words asegura que el texto se adapte y nunca se corte o desborde */}
                <h2 className="font-semibold text-gray-900 break-words">
                  {author.name}
                </h2>
              </div>
              
              {/* Botones que toman espacio físico para no tapar el texto */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-3">
                <ActionButtons 
                  id={author.id} 
                  editUrl={`/authors/${author.id}/edit`} 
                  deleteAction={deleteAuthor}
                  confirmMessage={`¿Seguro que quieres borrar a "${author.name}"?`}
                />
              </div>

            </div>
          ))}
        </div>

        {authors?.length === 0 && (
          <div className="text-center bg-white rounded-lg border border-gray-200 p-12 mt-4">
            <p className="text-gray-500">No hay autores registrados.</p>
          </div>
        )}
      </div>
    </main>
  );
}