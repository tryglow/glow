import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { ReactNode } from 'react';

import { Label } from '@/components/ui/label';

import { FormInput, FormInputWithPrefix } from '../FormInput';

interface Props {
  name: string;
  id: string;
  label: string;
  placeholder?: string;
  fieldType?: 'input' | 'textarea' | 'select';
  type?: 'text' | 'email' | 'number';
  error?: string | undefined;
  isTextArea?: boolean;
  children?: ReactNode;
  withPrefix?: string;
}

export function FormField({
  fieldType = 'input',
  children,
  name,
  label,
  id,
  placeholder,
  error,
  type = 'text',
  withPrefix,
}: Props) {
  const InputComponent = withPrefix ? FormInputWithPrefix : FormInput;
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <InputComponent
          fieldType={fieldType}
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
    </div>
  );
}
