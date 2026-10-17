import { createClient } from "@/utils/supabase/server";
import BooksClient, { FullBook } from "./BooksClient";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; bookId?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const targetBookId = params?.bookId;
  const searchQuery = params?.q?.trim() || "";

  // Configuración de la paginación
  const PAGE_SIZE = 20;
  const currentPage = Number(params?.page) || 1;
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 1. Conteo total de libros con filtro opcional por título
  let countQuery = supabase.from("books").select("*", { count: "exact", head: true });
  if (searchQuery) {
    countQuery = countQuery.ilike("title", `%${searchQuery}%`);
  }

  const { count } = await countQuery;
  const totalBooks = count || 0;
  const totalPages = Math.ceil(totalBooks / PAGE_SIZE) || 1;

  // 2. Consulta principal de libros con ordenación jerárquica y filtro por título
  let query = supabase
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
    .order("name", { referencedTable: "shelf_modules", ascending: true, nullsFirst: false })
    .order("name", { referencedTable: "series", ascending: true, nullsFirst: false })
    .order("position_in_series", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true })
    .range(from, to);

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  // Si se proporciona un bookId, buscar ese libro específico para el modal
  let targetBook = null;
  if (targetBookId) {
    const { data: foundBook } = await supabase
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
      .eq('id', targetBookId)
      .single();

    targetBook = foundBook;
  }

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-500">Error cargando el catálogo: {error.message}</p>
      </main>
    );
  }

  const books = data as unknown as FullBook[];

  // Helper para mantener los parámetros actuales en los links de paginación
  const createPageUrl = (pageNumber: number) => {
    const p = new URLSearchParams();
    if (pageNumber > 1) p.set("page", pageNumber.toString());
    if (searchQuery) p.set("q", searchQuery);
    if (targetBookId) p.set("bookId", targetBookId);
    const str = p.toString();
    return `/books${str ? `?${str}` : ""}`;
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-16">
      <div className="max-w-7xl mx-auto">
            
        <BooksClient 
          books={(books as FullBook[]) || []} 
          targetBook={targetBook as unknown as FullBook | null} 
          initialQuery={searchQuery}
        />

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-12 bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
            
            {currentPage > 1 ? (
              <Link
                href={createPageUrl(currentPage - 1)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 rounded-lg cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </span>
            )}

            <span className="text-sm font-medium text-gray-600">
              Página <span className="font-bold text-gray-900">{currentPage}</span> de <span className="font-bold text-gray-900">{totalPages}</span> 
              <span className="text-gray-400 ml-1">({totalBooks} libros encontrados)</span>
            </span>

            {currentPage < totalPages ? (
              <Link
                href={createPageUrl(currentPage + 1)}
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