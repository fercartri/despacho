import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Book, Archive, UserCheck, Clock } from "lucide-react";
import VisualShelf from "@/app/shelves/VisualShelf"; // ¡Llamamos a tu componente!

export default async function HomePage() {
  const supabase = await createClient();

  // 1. OBTENER ESTADÍSTICAS
  // Total de libros
  const { count: totalBooks } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true });

  // Libros prestados
  const { count: loanedBooks } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Prestado');

  // Total de módulos / estanterías creadas
  const { count: totalShelves } = await supabase
    .from('shelf_modules')
    .select('*', { count: 'exact', head: true });

  // 2. OBTENER LOS ÚLTIMOS 4 LIBROS AÑADIDOS
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

  // 3. OBTENER LOS DATOS PARA LA ESTANTERÍA VISUAL
  const { data: shelvesData } = await supabase
    .from("shelf_modules")
    .select("id, name, books(id)");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* CABECERA */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resumen de tu Biblioteca</h1>
          <p className="text-gray-500 mt-1">Bienvenido de nuevo. Aquí tienes un vistazo a tu colección.</p>
        </div>

        {/* 4 TARJETAS DE ESTADÍSTICAS (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center"><Book /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Libros</p>
              <p className="text-2xl font-bold text-gray-900">{totalBooks || 0}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center"><UserCheck /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Libros Prestados</p>
              <p className="text-2xl font-bold text-gray-900">{loanedBooks || 0}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center"><Archive /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Huecos en Uso</p>
              <p className="text-2xl font-bold text-gray-900">{totalShelves || 0} / 25</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center"><Clock /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Última Actividad</p>
              <p className="text-sm font-bold text-gray-900 mt-1">Hoy</p>
            </div>
          </div>
        </div>

        {/* ESTANTERÍA VISUAL */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-gray-900">Mapa del Mueble Principal</h2>
            <Link href="/shelves" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Gestionar huecos →</Link>
          </div>
          {/* ¡AQUÍ INYECTAMOS TU COMPONENTE DE LA ESTANTERÍA! */}
          <VisualShelf shelvesList={shelvesData || []} />
        </section>

        {/* ÚLTIMOS LIBROS AÑADIDOS */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-gray-900">Últimas Incorporaciones</h2>
            <Link href="/books" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Ir al catálogo completo →</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* 1. Forzamos a que recentBooks sea 'any' para apagar los errores de TypeScript */}
            {(recentBooks as any[])?.map((book) => {
              
              // 2. Extraemos la información del autor
              const authorsData = book?.book_authors?.[0]?.authors;
              
              // 3. Comprobamos de forma segura si es una lista (array) o un objeto simple
              const author = Array.isArray(authorsData) 
                ? authorsData[0]?.name 
                : authorsData?.name || 'Desconocido';
              
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