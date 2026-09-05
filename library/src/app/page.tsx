import { createClient } from "@/utils/supabase/server";

// Añadimos 'async' porque vamos a consultar a la base de datos
export default async function Home() {
  // 1. Inicializamos el cliente de Supabase que creamos antes
  const supabase = await createClient();

  // 2. Hacemos la consulta a nuestra tabla de prueba
  const { data, error } = await supabase.from("test_connection").select("*");

  // 3. Manejo de errores básico
  if (error) {
    return (
      <main className="p-8 text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error de conexión</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  // 4. Renderizamos el resultado
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Biblioteca Personal</h1>
      
      <div className="bg-green-100 p-4 rounded-md text-green-800">
        <p className="font-semibold">Mensaje desde la base de datos:</p>
        {/* Si hay datos, mostramos el mensaje de la primera fila */}
        <p>{data && data.length > 0 ? data[0].message : "No hay datos"}</p>
      </div>
    </main>
  );
}