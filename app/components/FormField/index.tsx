import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

import { ReactNode } from 'react'
import { FormLabel } from '../FormLabel'
import { FormInput, FormInputWithPrefix } from '../FormInput'
import { Label } from '@/components/ui/label'

interface Props {
  name: string
  id: string
  label: string
  placeholder?: string
  type?: 'text' | 'email'
  error?: string | undefined
  isSelect?: boolean
  children?: ReactNode
  withPrefix?: string
}

export function FormField({
  isSelect = false,
  children,
  name,
  label,
  id,
  placeholder,
  error,
  type = 'text',
  withPrefix,
}: Props) {
  const InputComponent = withPrefix ? FormInputWithPrefix : FormInput
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <InputComponent
          isSelect={isSelect}
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          ariaInvalid={error ? 'true' : 'false'}
          ariaDescribedby={`${name}-error`}
          prefix={withPrefix}
        >
          {children}
        </InputComponent>
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
        {error}
      </p>
    </>
  )
}
