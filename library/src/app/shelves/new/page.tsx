import { createShelf } from './actions'
import Link from 'next/link'
import { X } from 'lucide-react';

export default async function NewShelfPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Añadir nueva estantería</h1>
          </div>
          <Link href="/shelves" className="text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
            <X className="w-4 h-4" /> Cancelar
          </Link>
        </header>

        <form action={createShelf} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Nombre de la estantería *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              placeholder="Ej: 1.1"
            />
          </div>

          <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800">
            Guardar nueva estantería
          </button>
        </form>

      </div>
    </main>
  )
}