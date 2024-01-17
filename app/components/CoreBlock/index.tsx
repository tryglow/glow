import clsx from 'clsx';
import {ReactNode} from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

export function CoreBlock({className, children}: Props) {
  return (
    <div
      className={clsx(
        'bg-system-bg-primary border-system-bg-secondary border p-6 rounded-3xl h-full shadow-md overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
}
