import { createClient } from "@/utils/supabase/server";
import Link from "next/dist/client/link";

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
  const { data, error } = await supabase
    .from("books")
    .select(`
      id,
      title,
      year,
      cover_url,
      status,
      publishers (name)
    `);

  const books = data as BookWithPublisher[] | null;

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-500">Error cargando libros: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      BIBLIOTECA
    </main>
  );
}