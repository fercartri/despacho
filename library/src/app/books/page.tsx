import { createClient } from "@/utils/supabase/server";
import BooksClient, { FullBook } from "./BooksClient";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Configuración de la paginación
  const PAGE_SIZE = 20; // 20 libros por página
  const currentPage = Number(params?.page) || 1;
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Obtener el total de libros para calcular las páginas totales
  const { count } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true });

  const totalBooks = count || 0;
  const totalPages = Math.ceil(totalBooks / PAGE_SIZE);

  // Obtener libros del rango de la página
  const { data, error } = await supabase
    .from("books")
    .select(`
      id,
      title,
      isbn,
      year,
      edition,
      language,
      pages,
      description,
      cover_url,
      status,
      position_in_series,
      publishers (name),
      series (name),
      shelf_modules (name),
      book_authors (authors (name)),
      book_genres (genres (name))
    `)
    .order("title")
    .range(from, to);

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-500">Error cargando el catálogo: {error.message}</p>
      </main>
    );
  }

  const books = data as unknown as FullBook[];

  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-16">
      <div className="max-w-7xl mx-auto">
                
        {/* Aquí va tu componente cliente con la parrilla de libros */}
        <BooksClient books={(books as FullBook[]) || []} />

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-12 bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
            
            {/* Botón Anterior */}
            {currentPage > 1 ? (
              <Link
                href={`/books?page=${currentPage - 1}`}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 rounded-lg cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </span>
            )}

            {/* Texto informativo de página */}
            <span className="text-sm font-medium text-gray-600">
              Página <span className="font-bold text-gray-900">{currentPage}</span> de <span className="font-bold text-gray-900">{totalPages}</span> 
              <span className="text-gray-400 ml-1">({totalBooks} libros en total)</span>
            </span>

            {/* Botón Siguiente */}
            {currentPage < totalPages ? (
              <Link
                href={`/books?page=${currentPage + 1}`}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 rounded-lg cursor-not-allowed">
                Siguiente <ChevronRight className="w-4 h-4" />
              </span>
            )}

          </div>
        )}

      </div>
    </main>
  );
}