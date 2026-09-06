import { createBook } from './actions'
import Link from 'next/link'

export default async function NewBookPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Añadir Nuevo Libro</h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            ← Volver a la biblioteca
          </Link>
        </header>

        {params?.error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {params.error}
          </div>
        )}

        <form action={createBook} className="flex flex-col gap-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
              Título del libro *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-black"
              placeholder="Ej: El Señor de los Anillos"
            />
          </div>

          {/* Fila para Año y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">
                Año de publicación
              </label>
              <input
                id="year"
                name="year"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-black"
                placeholder="Ej: 1954"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                Estado actual
              </label>
              <select
                id="status"
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-black"
              >
                <option value="Disponible">Disponible</option>
                <option value="Prestado">Prestado</option>
              </select>
            </div>
          </div>

          {/* Botón de enviar */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Guardar Libro
            </button>
          </div>
        </form>

      </div>
    </main>
  )
}