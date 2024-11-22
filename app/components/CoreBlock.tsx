'use client';

import { AnchorHTMLAttributes, JSXElementConstructor, ReactNode } from 'react';

import { BlockProps } from '@/lib/blocks/ui';
import { cn } from '@/lib/utils';

import { EditBlockToolbar } from './EditBlockToolbar';
import { TextStyles, textStyling } from '@/lib/blocks/content/config';

interface Props extends BlockProps {
  className?: string;
  children: ReactNode;
  isFrameless?: boolean;
  component?: string | JSXElementConstructor<any>;
  linkProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  blockStyles?: TextStyles
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
  blockStyles=textStyling
}: Props) {
  return (
    <Component
      className={cn(
        'h-full overflow-hidden relative max-w-[624px]',
        !isFrameless &&
          'bg-sys-bg-primary border-sys-bg-border border p-6 rounded-3xl shadow-md ',
        className
      )}
      {...linkProps}
    >
      {children}
      {isEditable && blockType !== 'default' && (
        <EditBlockToolbar blockId={blockId} blockType={blockType} blockStyles={blockStyles} />
      )}
    </Component>
  );
}
