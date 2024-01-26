'use client';

import { ReactNode } from 'react';
import {
  Layout,
  Responsive,
  ResponsiveProps,
  WidthProvider,
} from 'react-grid-layout';

import { EditWrapper } from '../components/EditWrapper';
import { EditModeContextProvider } from '../contexts/Edit';

export const ResponsiveReactGridLayout = WidthProvider(Responsive);

export interface PageConfig {
  sm: Layout[];
  xss: Layout[];
}

interface Props {
  layout: PageConfig;
  children: ReactNode[];
  editMode?: boolean;
}

export default function Grid({ layout, children, editMode }: Props) {
  const layoutProps: ResponsiveProps = {
    useCSSTransforms: true,
    width: 624,
    rowHeight: 32,
    cols: { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 },
    margin: [10, 10],
    compactType: 'vertical',
    isResizable: editMode ? true : false,
    isDraggable: editMode ? true : false,
    isDroppable: editMode ? true : false,
  };

  if (editMode) {
    return (
      <EditModeContextProvider>
        <EditWrapper layoutProps={layoutProps}>{children}</EditWrapper>
      </EditModeContextProvider>
    );
  }

  return (
    <ResponsiveReactGridLayout
      layouts={{
        lg: layout.sm,
        md: layout.sm,
        sm: layout.sm,
        xs: layout.sm,
        xxs: layout.xss,
      }}
      {...layoutProps}
    >
      {children}
    </ResponsiveReactGridLayout>
  );
}
