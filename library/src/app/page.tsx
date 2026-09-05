import { createClient } from "@/utils/supabase/server";

// 1. Le decimos a TypeScript exactamente qué forma van a tener nuestros datos
type BookWithPublisher = {
  id: string;
  title: string;
  year: number | null;
  cover_url: string | null;
  status: string;
  publishers: { name: string } | null;
};

export default async function Home() {
  const supabase = await createClient();

  // 2. Añadimos .returns<BookWithPublisher[]>() al final de la consulta
  const { data: books, error } = await supabase
    .from("books")
    .select(`
      id,
      title,
      year,
      cover_url,
      status,
      publishers (name)
    `)
    .returns<BookWithPublisher[]>();

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-500">Error cargando libros: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Biblioteca</h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books?.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              
              <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                {book.cover_url ? (
                  <span>Portada disponible</span>
                ) : (
                  <span>Sin portada</span>
                )}
              </div>

              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">
                  {book.title}
                </h2>
                
                <p className="text-sm text-gray-500 mt-1">
                  {book.publishers?.name || "Sin editorial"} - {book.year}
                </p>

                <div className="mt-4 flex items-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    book.status === 'Disponible' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {book.status}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
        
        {books?.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            No hay libros en tu biblioteca todavía.
          </div>
        )}
      </div>
    </main>
  );
}