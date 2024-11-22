import {
  integrationUIConfig,
  SupportedIntegrations,
} from '@/app/components/BlockIntegrationUI';
import {
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
} from '@/app/components/ui/sidebar';
import { internalApiFetcher } from '@/lib/fetch';
import { Integration } from '@tryglow/prisma';
import useSWR from 'swr';

export function SidebarIntegrations() {
  const { data: currentTeamIntegrations, isLoading } = useSWR<
    Partial<Integration>[]
  >('/integrations/me', internalApiFetcher);

  return (
    <>
      <SidebarContentHeader title="Integrations" />

      <SidebarGroup>
        <SidebarGroupContent>
          {isLoading ? (
            <div className="w-full aspect-square bg-stone-200 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                Loading integrations...
              </span>
            </div>
          ) : currentTeamIntegrations?.length ? (
            <div className="flex flex-col gap-2 divide-y divide-stone-200">
              {currentTeamIntegrations?.map((integration) => {
                const integrationConfig =
                  integrationUIConfig[
                    integration.type as SupportedIntegrations
                  ];
                return (
                  <div
                    className="w-full px-2 py-1 flex items-center"
                    key={integration.id}
                  >
                    {integrationConfig.icon}
                    <span className="text-sm font-medium ml-2">
                      {integrationConfig.name}{' '}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {integration.displayName &&
                        `- ${integration.displayName}`}
                    </span>
                  </div>
                );
              })}
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
