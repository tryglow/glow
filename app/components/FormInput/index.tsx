import clsx from 'clsx';
import {Field} from 'formik';
import {ReactNode} from 'react';

interface Props {
  name: string;
  id: string;
  placeholder?: string;
  type?: 'text' | 'email';
  initialValue?: string;
  hasError?: boolean;
  ariaDescribedby?: string;
  ariaInvalid?: 'true' | 'false';
  isSelect?: boolean;
  children?: ReactNode;
}

export function FormInput({
  name,
  placeholder,
  initialValue,
  hasError,
  type = 'text',
  ariaInvalid,
  ariaDescribedby,
  isSelect,
  children,
}: Props) {
  return (
    <Field
      as={isSelect ? 'select' : 'input'}
      name={name}
      placeholder={placeholder}
      type={type}
      className={clsx(
        'block w-full rounded-md border-0 py-1.5 pr-1 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
        hasError
          ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500'
          : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-gray-500'
      )}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
    >
      {isSelect ? children : undefined}
    </Field>
  );
}
