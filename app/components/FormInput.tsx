import { Field } from 'formik';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  name: string;
  id: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'number' | 'checkbox';
  initialValue?: string;
  hasError?: boolean;
  ariaDescribedby?: string;
  ariaInvalid?: 'true' | 'false';
  fieldType?: 'input' | 'textarea' | 'select';
  children?: ReactNode;
  prefix?: string;
  disabled?: boolean;
}

export function FormInput({
  name,
  placeholder,
  initialValue,
  hasError,
  type = 'text',
  ariaInvalid,
  ariaDescribedby,
  fieldType = 'input',
  children,
  disabled,
}: Props) {
  return (
    <Field
      as={fieldType}
      name={name}
      placeholder={placeholder}
      type={type}
      className={cn(
        'block rounded-md border-0 px-3 py-1.5 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
        type !== 'checkbox' && 'w-full',
        fieldType === "textarea" && 'h-32',
        disabled && 'bg-gray-100',
        hasError
          ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500'
          : 'text-gray-900 ring-input placeholder:text-gray-400 focus:ring-gray-500'
      )}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
      disabled={disabled}
    >
      {fieldType === 'select' ? children : undefined}
    </Field>
  );
}

export function FormInputWithPrefix({
  name,
  placeholder,
  initialValue,
  hasError,
  type = 'text',
  fieldType = 'input',
  ariaInvalid,
  ariaDescribedby,
  children,
  prefix,
}: Props) {
  return (
    <div className="flex">
      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
        {prefix}
      </span>
      <Field
        as={fieldType}
        name={name}
        placeholder={placeholder}
        type={type}
        className="block w-full min-w-0 flex-1 pl-3 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-input placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
      >
        {fieldType === 'select' ? children : undefined}
      </Field>
    </div>
  );
}
