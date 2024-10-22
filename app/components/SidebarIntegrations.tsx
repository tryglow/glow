import {
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
} from '@/app/components/ui/sidebar';
import { fetcher } from '@/lib/fetch';
import { Integration } from '@prisma/client';
import useSWR from 'swr';

export function SidebarIntegrations() {
  const { data: currentTeamIntegrations, isLoading } = useSWR<
    Partial<Integration>[]
  >('/api/user/integrations', fetcher);

  return (
    <>
      <SidebarContentHeader title="Integrations"></SidebarContentHeader>

      <SidebarGroup>
        <SidebarGroupContent>
          {isLoading ? (
            <div className="w-full aspect-square bg-stone-200 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                Loading integrations...
              </span>
            </div>
          ) : currentTeamIntegrations?.length ? (
            <div className="flex flex-col gap-2">
              {currentTeamIntegrations?.map((integration) => (
                <div key={integration.id}>{integration.id}</div>
              ))}
            </div>
          ) : (
            <div className="w-full aspect-square bg-stone-200 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                No integrations found
              </span>
            </div>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
