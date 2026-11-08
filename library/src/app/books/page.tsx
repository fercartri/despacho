import { createClient } from "@/utils/supabase/server";
import BooksClient, { FullBook } from "./BooksClient";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    page?: string; 
    bookId?: string; 
    q?: string; 
    series?: string; 
    author?: string; 
    genre?: string; 
    publisher?: string;
    module?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const targetBookId = params?.bookId;
  const searchQuery = params?.q?.trim() || "";
  const selectedSeries = params?.series ? params.series.split(",") : [];
  const selectedAuthors = params?.author ? params.author.split(",") : [];
  const selectedGenres = params?.genre ? params.genre.split(",") : [];
  const selectedPublishers = params?.publisher ? params.publisher.split(",") : [];
  const selectedModules = params?.module ? params.module.split(",") : [];

  const PAGE_SIZE = 20;
  const currentPage = Number(params?.page) || 1;

  // 1. Consultar TODOS los libros para filtrado y ordenación global exacta
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
    `);

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-500">Error cargando el catálogo: {error.message}</p>
      </main>
    );
  }

  let allBooks = (data as unknown as FullBook[]) || [];

  // 2. APLICAR FILTROS EN EL SERVIDOR
  if (selectedSeries.length > 0) {
    allBooks = allBooks.filter(b => b.series?.name && selectedSeries.includes(b.series.name));
  }
  if (selectedPublishers.length > 0) {
    allBooks = allBooks.filter(b => b.publishers?.name && selectedPublishers.includes(b.publishers.name));
  }
  if (selectedModules.length > 0) {
    allBooks = allBooks.filter(b => b.shelf_modules?.name && selectedModules.includes(b.shelf_modules.name));
  }
  if (selectedAuthors.length > 0) {
    allBooks = allBooks.filter(b => {
      const authors = b.book_authors.map(ba => ba.authors?.name).filter(Boolean);
      return selectedAuthors.some(a => authors.includes(a));
    });
  }
  if (selectedGenres.length > 0) {
    allBooks = allBooks.filter(b => {
      const genres = b.book_genres.map(bg => bg.genres?.name).filter(Boolean);
      return selectedGenres.some(g => genres.includes(g));
    });
  }

  // 3. ORDENACIÓN JERÁRQUICA GLOBAL (Módulo > Saga > Posición > Título)
  allBooks.sort((a, b) => {
    const modA = a.shelf_modules?.name || '';
    const modB = b.shelf_modules?.name || '';
    if (modA !== modB) {
      if (!modA) return 1;
      if (!modB) return -1;
      return modA.localeCompare(modB);
    }

    const seriesA = a.series?.name || '';
    const seriesB = b.series?.name || '';
    if (seriesA !== seriesB) {
      if (!seriesA) return 1;
      if (!seriesB) return -1;
      return seriesA.localeCompare(seriesB);
    }

    const posA = a.position_in_series ?? 999999;
    const posB = b.position_in_series ?? 999999;
    if (posA !== posB) {
      return posA - posB;
    }

    return (a.title || '').localeCompare(b.title || '');
  });

  // 4. OBTENER LISTAS MAESTRAS COMPLETAS DE LA BASE DE DATOS PARA LOS FILTROS
  const [
    { data: authorsData },
    { data: publishersData },
    { data: genresData },
    { data: seriesData },
    { data: modulesData }
  ] = await Promise.all([
    supabase.from("authors").select("name").order("name", { ascending: true }),
    supabase.from("publishers").select("name").order("name", { ascending: true }),
    supabase.from("genres").select("name").order("name", { ascending: true }),
    supabase.from("series").select("name").order("name", { ascending: true }),
    supabase.from("shelf_modules").select("name").order("name", { ascending: true }),
  ]);

  const allAuthors = authorsData?.map(a => a.name).filter(Boolean) || [];
  const allPublishers = publishersData?.map(p => p.name).filter(Boolean) || [];
  const allGenres = genresData?.map(g => g.name).filter(Boolean) || [];
  const allSeries = seriesData?.map(s => s.name).filter(Boolean) || [];
  const allModules = modulesData?.map(m => m.name).filter(Boolean) || [];

  // 5. PAGINACIÓN GLOBAL
  const totalBooks = allBooks.length;
  const totalPages = Math.ceil(totalBooks / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedBooks = allBooks.slice(startIndex, startIndex + PAGE_SIZE);

  let targetBook = null;
  if (targetBookId) {
    const { data: foundBook } = await supabase
      .from("books")
      .select(`
        id, title, isbn, year, edition, language, pages, description, cover_url, status, position_in_series,
        publishers (name), series (name), shelf_modules (name),
        book_authors (authors (name)), book_genres (genres (name))
      `)
      .eq('id', targetBookId)
      .single();
    targetBook = foundBook;
  }

  const createPageUrl = (pageNumber: number) => {
    const p = new URLSearchParams();
    if (pageNumber > 1) p.set("page", pageNumber.toString());
    if (searchQuery) p.set("q", searchQuery);
    if (params?.series) p.set("series", params.series);
    if (params?.author) p.set("author", params.author);
    if (params?.genre) p.set("genre", params.genre);
    if (params?.publisher) p.set("publisher", params.publisher);
    if (params?.module) p.set("module", params.module);
    if (targetBookId) p.set("bookId", targetBookId);
    const str = p.toString();
    return `/books${str ? `?${str}` : ""}`;
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-16">
      <div className="max-w-7xl mx-auto">
            
        <BooksClient 
          books={paginatedBooks} 
          targetBook={targetBook as unknown as FullBook | null} 
          initialQuery={searchQuery}
          allAuthors={allAuthors}
          allPublishers={allPublishers}
          allGenres={allGenres}
          allSeries={allSeries}
          allModules={allModules}
        />

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-12 bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
            {currentPage > 1 ? (
              <Link href={createPageUrl(currentPage - 1)} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
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
              <Link href={createPageUrl(currentPage + 1)} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
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