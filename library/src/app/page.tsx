import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Book, ChevronRight, Library, UserCheck } from "lucide-react";
import VisualShelf from "@/app/shelves/VisualShelf"; // ¡Llamamos a tu componente!

export default async function HomePage() {
  const supabase = await createClient();

  // Estadísticas
  const { count: totalBooks } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true });

  const { count: loanedBooks } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Prestado');

  const { count: totalSeries } = await supabase
    .from('series')
    .select('*', { count: 'exact', head: true });

  // Últimos añadidos
  const { data: recentBooks } = await supabase
    .from('books')
    .select(`
      id, 
      title, 
      cover_url,
      book_authors ( authors ( name ) )
    `)
    .order('created_at', { ascending: false })
    .limit(4);

  // Datos de estantería visual
  const { data: shelvesData } = await supabase
    .from("shelf_modules")
    .select("id, name, books(id)");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* CABECERA */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biblioteca</h1>
        </div>

        {/* 4 TARJETAS DE ESTADÍSTICAS (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center"><Book /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total de libros</p>
              <p className="text-2xl font-bold text-gray-900">{totalBooks || 0}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center"><UserCheck /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Libros prestados</p>
              <p className="text-2xl font-bold text-gray-900">{loanedBooks || 0}</p>
            </div>
          </div>
        </div>

        {/* ESTANTERÍA VISUAL */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-gray-900">Estantería principal</h2>
            <Link href="/shelves" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Gestionar estanterías
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <VisualShelf shelvesList={shelvesData || []} />
        </section>

        {/* ÚLTIMOS LIBROS AÑADIDOS */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-gray-900">Últimos libros añadidos</h2>
            <Link href="/books" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Catálogo completo
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(recentBooks as any[])?.map((book) => {
              
              const authorsData = book?.book_authors?.[0]?.authors;

              const author = book?.book_authors
                ?.map((ba: any) => ba?.authors?.name)
                .filter(Boolean)
                .join(', ') || 'Autor desconocido';
              
              return (
                <Link href={`/books?bookId=${book.id}`} key={book.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center relative border-b border-gray-100">
                    {book.cover_url ? (
                      <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-gray-400 text-sm">Sin portada</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{author}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

      </div>
    </main>
  );
}