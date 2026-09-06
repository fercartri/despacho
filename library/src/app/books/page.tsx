import { createClient } from "@/utils/supabase/server";
import BooksClient, { type FullBook } from "./BooksClient";

export default async function BooksPage() {
  const supabase = await createClient();

  // Fíjate en la sintaxis de Supabase para las relaciones Muchos-a-Muchos:
  // book_authors ( authors ( name ) ) -> Trae los autores a través de la tabla puente.
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
      book_authors (
        authors (name)
      ),
      book_genres (
        genres (name)
      )
    `)
    .order("title");

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-500">Error cargando el catálogo: {error.message}</p>
      </main>
    );
  }

  // Hacemos el "cast" manual al tipo que definimos en el cliente
  const books = data as unknown as FullBook[];

  return (
    <main className="p-8 min-h-screen bg-gray-50">
      {/* Llamamos a nuestro componente cliente y le pasamos los datos */}
      <BooksClient books={books} />
    </main>
  );
}