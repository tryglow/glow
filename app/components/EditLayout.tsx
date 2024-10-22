import { AppSidebar } from '@/app/components/EditSidebar';
import { SidebarInset, SidebarTrigger } from '@/app/components/ui/sidebar';
import { ReactNode } from 'react';

export function EditLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="mt-[68px]">
        <SidebarTrigger className="mt-3 ml-3 text-sys-label-primary" />
        {children}
      </SidebarInset>
    </>
  );
}
