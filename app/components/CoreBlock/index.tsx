'use client';

import clsx from 'clsx';
import { LinkProps } from 'next/link';
import {
  AnchorHTMLAttributes,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from 'react';

import { BlockProps } from '@/lib/blocks/ui';

import { EditBlockToolbar } from '../EditBlockToolbar';

interface Props extends BlockProps {
  className?: string;
  children: ReactNode;
  isFrameless?: boolean;
  component?: string | JSXElementConstructor<any>;
  linkProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

export function CoreBlock({
  blockId,
  blockType,
  isEditable,
  className,
  children,
  isFrameless,
  component: Component = 'div',
  linkProps,
}: Props) {
  return (
    <Component
      className={clsx(
        'h-full overflow-hidden relative',
        !isFrameless &&
          'bg-sys-bg-primary border-system-bg-secondary border p-6 rounded-3xl shadow-md ',
        className
      )}
      {...linkProps}
    >
      {children}
      {isEditable && blockType !== 'default' && (
        <EditBlockToolbar blockId={blockId} blockType={blockType} />
      )}
    </Component>
  );
}
