interface ButtonProps {
  label: string
  onClick: () => void
  color?: 'blue' | 'red' | 'yellow' | 'gray' | 'green'
}

const colorMap: Record<string, string> = {
  blue: 'text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white',
  red: 'text-red-600 border-red-600 hover:bg-red-600 hover:text-white',
  yellow: 'text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white',
  gray: 'text-gray-600 border-gray-600 hover:bg-gray-600 hover:text-white',
  green: 'text-green-600 border-green-600 hover:bg-green-600 hover:text-white',
}

export default function Button({ label, onClick, color = 'gray' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 border rounded text-xs font-medium transition-colors duration-200 ${colorMap[color]}`}
    >
      {label}
    </button>
  )
}
