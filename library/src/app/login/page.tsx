import { login } from './actions'

export default async function LoginPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ error?: string }> 
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Entrar a la Biblioteca
        </h1>
        
        {/* Si el servidor nos devuelve un error, lo pintamos de rojo */}
        {params?.error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {params.error}
          </div>
        )}

        {/* Fíjate cómo conectamos el formulario con nuestra función 'login' del servidor */}
        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}