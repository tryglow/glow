'use client';

import { ReactNode } from 'react';
import ReactGridLayout, {
  Layout,
  ReactGridLayoutProps,
} from 'react-grid-layout';

import { EditWrapper } from '../components/EditWrapper';
import { EditModeContextProvider } from '../contexts/Edit';

interface Props {
  layout: Layout[];
  children: ReactNode[];
  editMode?: boolean;
}

export default function Grid({ layout, children, editMode }: Props) {
  const layoutProps: ReactGridLayoutProps = {
    useCSSTransforms: true,
    width: 624,
    rowHeight: 30,
    cols: 12,
    margin: [10, 10],
    compactType: 'vertical',
    isResizable: editMode ? true : false,
    isDraggable: editMode ? true : false,
    isDroppable: editMode ? true : false,
  };

  if (editMode) {
    return (
      <EditModeContextProvider>
        <EditWrapper layout={layout} layoutProps={layoutProps}>
          {children}
        </EditWrapper>
      </EditModeContextProvider>
    );
  }

  return (
    <ReactGridLayout layout={layout} {...layoutProps}>
      {children}
    </ReactGridLayout>
  );
}
