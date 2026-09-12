import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import SeriesAccordion from "./SeriesAccordion";

export default async function SeriesPage() {
  const supabase = await createClient();
  
  // Pedimos las sagas y la información clave de cada libro
  const { data: series } = await supabase
    .from("series")
    .select(`
      id, 
      name,
      books ( 
        id, 
        title, 
        status, 
        position_in_series 
      )
    `)
    .order("name");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sagas y Colecciones</h1>
            <p className="text-gray-500 mt-1">Explora tus libros agrupados por series.</p>
          </div>
          <Link href="/series/new" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm">
            + Nueva Saga
          </Link>
        </header>

        {/* Inyectamos el componente interactivo con los datos */}
        <SeriesAccordion seriesList={series || []} />

      </div>
    </main>
  );
}