'use client'

type ItemWithName = {
  name: string
}

type AlphabetNavProps = {
  items: ItemWithName[]
}

export default function AlphabetNav({ items }: AlphabetNavProps) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  // Normalizamos y obtenemos el conjunto de letras iniciales disponibles
  const availableLetters = new Set(
    items.map(item => {
      const firstChar = item.name.trim().charAt(0).toUpperCase()
      return firstChar.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    })
  )

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`anchor-letter-${letter}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-1.5 bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
      {alphabet.map(letter => {
        const isAvailable = availableLetters.has(letter)
        return (
          <button
            key={letter}
            onClick={() => isAvailable && scrollToLetter(letter)}
            disabled={!isAvailable}
            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
              isAvailable
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-900 hover:text-white cursor-pointer shadow-xs'
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }`}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )
}