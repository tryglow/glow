import {ExclamationCircleIcon} from '@heroicons/react/20/solid';
import clsx from 'clsx';

import {ReactNode} from 'react';
import {FormLabel} from '../FormLabel';
import {FormInput} from '../FormInput';

interface Props {
  name: string;
  id: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email';
  error?: string | undefined;
  isSelect?: boolean;
  children?: ReactNode;
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
}: Props) {
  return (
    <div>
      <FormLabel label={label} htmlFor={name} />
      <div className="relative mt-2 rounded-md shadow-sm">
        <FormInput
          isSelect={isSelect}
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          ariaInvalid={error ? 'true' : 'false'}
          ariaDescribedby={`${name}-error`}
        >
          {children}
        </FormInput>
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
    </div>
  );
}
