import { ReactNode } from 'react';
import MarketingNavigation from '../components/MarketingNavigation';
import MarketingFooter from '../components/MarketingFooter';

interface Props {
  children: ReactNode;
}

export default function IPageLayout({ children }: Props) {
  return (
    <>
      <MarketingNavigation />
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}
