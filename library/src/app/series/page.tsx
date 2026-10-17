import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import SeriesAccordion from "./SeriesAccordion";
import { Plus } from "lucide-react";

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
    <main className="min-h-screen bg-gray-50 p-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sagas y Colecciones</h1>
          <Link href="/series/new" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Nueva saga
          </Link>
        </header>

        <SeriesAccordion seriesList={series || []} />

        {series?.length === 0 && (
          <div className="text-center bg-white rounded-lg border border-gray-200 p-12 mt-4">
            <p className="text-gray-500">Todavía no hay sagas registradas</p>
          </div>
        )}
      </div>
    </main>
  );
}