import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import ActionButtons from '@/components/ActionButtons'
import { deletePublisher } from '@/app/actions/delete'

export default async function PublishersPage() {
  const supabase = await createClient();
  const { data: publishers } = await supabase.from("publishers").select("*").order("name");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Editoriales</h1>
          <Link 
            href="/publishers/new" 
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium shadow-sm"
          >
            + Nueva Editorial
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {publishers?.map((publisher) => (
            <div key={publisher.id} className="group bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-lg hover:border-gray-300 transition-all h-full">
              
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 text-lg">
                  🏢
                </div>
                <h2 className="font-semibold text-gray-900 break-words">
                  {publisher.name}
                </h2>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-3">
                <ActionButtons 
                  id={publisher.id} 
                  editUrl={`/publishers/${publisher.id}/edit`} 
                  deleteAction={deletePublisher}
                  confirmMessage={`¿Seguro que quieres borrar la editorial "${publisher.name}"?`}
                />
              </div>

            </div>
          ))}
        </div>
        
        {publishers?.length === 0 && (
          <div className="text-center bg-white rounded-lg border border-gray-200 p-12 mt-4">
            <p className="text-gray-500">No hay editoriales registradas.</p>
          </div>
        )}
      </div>
    </main>
  );
}