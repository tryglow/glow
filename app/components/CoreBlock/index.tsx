'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';

import { BlockProps } from '@/lib/blocks/ui';

import { EditBlockToolbar } from '../EditBlockToolbar';

interface Props extends BlockProps {
  className?: string;
  children: ReactNode;
  isFrameless?: boolean;
}

export function CoreBlock({
  blockId,
  blockType,
  isEditable,
  className,
  children,
  isFrameless,
}: Props) {
  return (
    <div
      className={clsx(
        'h-full overflow-hidden relative',
        !isFrameless &&
          'bg-sys-bg-primary border-system-bg-secondary border p-6 rounded-3xl shadow-md ',
        className
      )}
    >
      {children}
      {isEditable && blockType !== 'default' && (
        <EditBlockToolbar blockId={blockId} blockType={blockType} />
      )}
    </div>
  );
}
