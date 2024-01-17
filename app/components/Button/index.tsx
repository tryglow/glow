import clsx from 'clsx'
import { ReactNode } from 'react'

interface Props {
  label: string
  icon?: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
}

const variants = {
  primary: 'bg-stone-900 text-white shadow-sm',
  secondary:
    'bg-white text-stone-900 shadow-sm ring-stone-300 hover:bg-stone-50',
}

export function Button({
  label,
  icon,
  onClick,
  type = 'button',
  variant = 'primary',
  isLoading,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'rounded-full px-3 py-2 text-sm font-semibold ring-inset ring-1 relative',
        variants[variant]
      )}
    >
      <span
        className={clsx(
          'flex items-center gap-2',
          isLoading ? 'opacity-0' : undefined
        )}
      >
        {icon}
        {label}
      </span>
      {isLoading && (
        <div className="absolute flex items-center justify-center w-full h-full top-0 left-0">
          <svg
            className="animate-spin h-5 w-5 text-currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </button>
  )
}
