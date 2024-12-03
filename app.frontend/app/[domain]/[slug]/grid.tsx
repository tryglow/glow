'use client';

import { EditLayout } from '@/app/components/EditLayout';
import { EditModeContextProvider } from '@/app/contexts/Edit';
import { GlobalNavigation } from '@/components/GlobalNavigation';
import { WidthProvideRGL } from '@/components/WidthProvider';
import dynamic from 'next/dynamic';
import { ReactNode, useMemo, useEffect } from 'react';
import { Layout, Responsive, ResponsiveProps } from 'react-grid-layout';

// Performance monitoring function
function reportPerformanceMetrics() {
  if (typeof window === 'undefined') return;

  // Get navigation timing
  const navigation = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming;

  // Get resource timing for key resources
  const resources = performance.getEntriesByType('resource');
  const jsResources = resources.filter((r) => r.name.endsWith('.js'));
  const cssResources = resources.filter((r) => r.name.endsWith('.css'));
  const imageResources = resources.filter(
    (r) =>
      r.name.endsWith('.png') ||
      r.name.endsWith('.jpg') ||
      r.name.endsWith('.webp')
  );

  // Calculate metrics
  const metrics = {
    // Navigation timing
    timeToFirstByte: navigation.responseStart - navigation.requestStart,
    domContentLoaded:
      navigation.domContentLoadedEventEnd - navigation.requestStart,
    fullPageLoad: navigation.loadEventEnd - navigation.requestStart,

    // Resource timing
    totalJSSize: jsResources.reduce(
      (acc, r) => acc + (r as PerformanceResourceTiming).encodedBodySize,
      0
    ),
    totalCSSSize: cssResources.reduce(
      (acc, r) => acc + (r as PerformanceResourceTiming).encodedBodySize,
      0
    ),
    totalImageSize: imageResources.reduce(
      (acc, r) => acc + (r as PerformanceResourceTiming).encodedBodySize,
      0
    ),

    // Server timing (from response headers)
    serverTiming: navigation.serverTiming || [],
  };

  // Send metrics to analytics
  if (process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN) {
    fetch('https://api.us-west-2.aws.tinybird.co/v0/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'page_performance',
        timestamp: new Date().toISOString(),
        data: metrics,
      }),
    }).catch(console.error);
  }
}

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

// Dynamically import EditWrapper
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
  editMode = false,
  isPotentiallyMobile,
  isLoggedIn,
}: Props) {
  useEffect(() => {
    // Report performance metrics after the page has loaded
    if (document.readyState === 'complete') {
      reportPerformanceMetrics();
    } else {
      window.addEventListener('load', reportPerformanceMetrics);
      return () => window.removeEventListener('load', reportPerformanceMetrics);
    }
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (editMode) {
    return (
      <EditModeContextProvider>
        <GlobalNavigation isEditMode />
        <EditLayout>
          <DynamicEditWrapper layoutProps={defaultLayoutProps}>
            {children}
          </DynamicEditWrapper>
        </EditLayout>
      </EditModeContextProvider>
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
    </>
  );
}
