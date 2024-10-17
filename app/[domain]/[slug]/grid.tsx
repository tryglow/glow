'use client';

import { Page, Team } from '@prisma/client';
import { ReactNode, useMemo } from 'react';
import { Layout, Responsive, ResponsiveProps } from 'react-grid-layout';

import { EditModeContextProvider } from '@/app/contexts/Edit';

import { EditWrapper } from '@/components/EditWrapper';
import { GlobalNavigation } from '@/components/GlobalNavigation';
import { WidthProvideRGL } from '@/components/WidthProvider';

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
  usersTeams?: Team[];
  currentTeamId?: string;
}

export default function Grid({
  layout,
  children,
  editMode,
  teamPages,
  isLoggedIn,
  isPotentiallyMobile = false,
  usersTeams,
  currentTeamId,
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
        <GlobalNavigation
          teamPages={teamPages}
          isEditMode
          usersTeams={usersTeams}
          currentTeamId={currentTeamId}
        />
        <EditWrapper layoutProps={defaultLayoutProps}>{children}</EditWrapper>
      </EditModeContextProvider>
    );
  }

  return (
    <>
      {isLoggedIn && (
        <GlobalNavigation
          teamPages={teamPages}
          usersTeams={usersTeams}
          currentTeamId={currentTeamId}
        />
      )}
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
