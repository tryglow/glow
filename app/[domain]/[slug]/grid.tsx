'use client';

import { Page } from '@prisma/client';
import { ReactNode, useMemo } from 'react';
import { Layout, Responsive, ResponsiveProps } from 'react-grid-layout';

import { EditWrapper } from '../../components/EditWrapper';
import { GlobalNavigation } from '../../components/GlobalNavigation';
import { WidthProvideRGL } from '../../components/WidthProvider';
import { EditModeContextProvider } from '../../contexts/Edit';

export interface PageConfig {
  sm: Layout[];
  xxs: Layout[];
}

interface Props {
  layout: PageConfig;
  children: ReactNode[];
  editMode?: boolean;
  teamPages: Page[] | null;
  isPotentiallyMobile: boolean;
  isLoggedIn: boolean;
}

export default function Grid({
  layout,
  children,
  editMode,
  teamPages,
  isLoggedIn,
  isPotentiallyMobile = false,
}: Props) {
  const defaultLayoutProps: ResponsiveProps = {
    useCSSTransforms: true,
    width: 624,
    rowHeight: 32,
    cols: { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 },
    margin: [10, 10],
    containerPadding: {
      lg: [0, 20],
      md: [0, 20],
      sm: [0, 20],
      xs: [0, 20],
      xxs: [10, 20],
    },
    compactType: 'vertical',
    isResizable: editMode ? true : false,
    isDraggable: editMode ? true : false,
    isDroppable: editMode ? true : false,
  };

  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvideRGL(Responsive, isPotentiallyMobile),
    []
  );

  if (editMode) {
    return (
      <EditModeContextProvider>
        <GlobalNavigation teamPages={teamPages} isEditMode />
        <EditWrapper layoutProps={defaultLayoutProps}>{children}</EditWrapper>
      </EditModeContextProvider>
    );
  }

  return (
    <>
      {isLoggedIn && <GlobalNavigation teamPages={teamPages} />}
      <ResponsiveReactGridLayout
        layouts={{
          lg: layout.sm,
          md: layout.sm,
          sm: layout.sm,
          xs: layout.sm,
          xxs: layout.xxs,
        }}
        {...defaultLayoutProps}
      >
        {children}
      </ResponsiveReactGridLayout>
    </>
  );
}
