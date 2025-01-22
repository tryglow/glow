'use client';

import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Layout, Responsive, ResponsiveProps } from 'react-grid-layout';

import { EditModeContextProvider } from '@/app/contexts/Edit';

import { EditLayout } from '@/app/components/EditLayout';
import { GlobalNavigation } from '@/components/GlobalNavigation';
import { WidthProvideRGL } from '@/components/WidthProvider';
import dynamic from 'next/dynamic';
import { createContext } from 'vm';
import { useGridAngleContext } from '@/app/contexts/GridAngle';

export interface PageConfig {
  sm: Layout[];
  xxs: Layout[];
}

interface Props {
  layout: PageConfig;
  children: ReactNode[];
  editMode?: boolean;
  isPotentiallyMobile: boolean;
  isLoggedIn: boolean;
}

// Dynamically import EditWrapper so it doesn't get imported on the server
// which will make the logged-out app a bit lighter, as well as remove the
// need to import the polyfills in the EditWrapper
const DynamicEditWrapper = dynamic(
  () =>
    import('@/app/components/EditWrapper').then((mod) => ({
      default: mod.EditWrapper,
    })),
  { ssr: false }
);

export default function Grid({
  layout,
  children,
  editMode,
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

  // const { angle } = useGridAngleContext();

  // const rotatedLayout = useMemo(() => {
  //   console.log('useMemo => ', angle, layout);
    
  //   if (angle === 90 || angle === 270) {
  //     // Swap rows and columns
  //     return {
  //       sm: layout.sm.map((item) => ({ ...item, w: item.h, h: item.w })),
  //       xxs: layout.xxs.map((item) => ({ ...item, w: item.h, h: item.w })),
  //     };
  //   }
  //   return layout; // Default 
  // }, [angle, layout]);

  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvideRGL(Responsive, isPotentiallyMobile),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (editMode) {
    return (
      <>
        <GlobalNavigation isEditMode />
        <EditLayout>
          <DynamicEditWrapper layoutProps={defaultLayoutProps}>
            {children}
          </DynamicEditWrapper>
        </EditLayout>
      </>
    );
  }

  return (
    <>
      {isLoggedIn && <GlobalNavigation isEditMode={false} />}
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
      {/* Footer */}
      <a href='https://zaviago.com' target='blank' className='block mt-14 mb-12 text-center text-sys-label-primary leading-5 tracking-wider'>Built with Ello by Zaviago</a>
    </>
  );
}
