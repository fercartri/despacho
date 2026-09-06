import { createPublisher } from './actions'
import Link from 'next/link'

export default async function NewPublisherPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Añadir Nueva Editorial</h1>
          <Link href="/publishers" className="text-sm text-gray-500 hover:text-gray-900">
            ← Volver a editoriales
          </Link>
        </header>

        {params?.error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {params.error}
          </div>
        )}

        <form action={createPublisher} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Nombre de la editorial *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              placeholder="Ej: Penguin Random House"
            />
          </div>

          <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800">
            Guardar Editorial
          </button>
        </form>
      </div>
    </main>
  )
}