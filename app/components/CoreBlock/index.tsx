'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';

import { BlockProps } from '@/lib/blocks/ui';

import { EditBlockToolbar } from '../EditBlockToolbar';

interface Props extends BlockProps {
  className?: string;
  children: ReactNode;
}

export function CoreBlock({
  blockId,
  blockType,
  isEditable,
  className,
  children,
}: Props) {
  return (
    <div
      className={clsx(
        'bg-system-bg-primary border-system-bg-secondary border p-6 rounded-3xl h-full shadow-md overflow-hidden relative',
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
