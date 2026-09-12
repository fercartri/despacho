import { Library, Building2, Tag, SquareLibrary } from 'lucide-react'

// Avatar circular para Autores
export function AuthorAvatar({ name }: { name: string }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?'
  
  return (
    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm flex-shrink-0">
      <span className="text-slate-600 font-semibold text-lg font-serif">
        {initial}
      </span>
    </div>
  )
}

// Icono para Sagas / Colecciones
export function SeriesIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm flex-shrink-0">
      <Library className="w-5 h-5 text-indigo-600" strokeWidth={1.5} />
    </div>
  )
}

// Icono para Estanterías / Módulos
export function ShelfIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shadow-sm flex-shrink-0">
      <SquareLibrary className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
    </div>
  )
}

// Icono para Editoriales
export function PublisherIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm flex-shrink-0">
      <Building2 className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
    </div>
  )
}

// Icono para Géneros / Etiquetas
export function GenreIcon() {
  return (
    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm flex-shrink-0">
      <Tag className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
    </div>
  )
}