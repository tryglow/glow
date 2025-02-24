import { EditPageSettingsGeneral } from '@/app/components/EditPageSettingsDialog/EditPageSettingsGeneralForm';
import { internalApiFetcher } from '@/lib/fetch';
import { Page } from '@tryglow/prisma';
import {
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
} from '@tryglow/ui';
import useSWR, { useSWRConfig } from 'swr';

export function SidebarPageSettings() {
  const { cache } = useSWRConfig();

  const pageId = cache.get('pageId');

  const { data: pageSettings } = useSWR<Partial<Page>>(
    `/pages/${pageId}/settings`,
    internalApiFetcher
  );

  return (
    <>
      <SidebarContentHeader title="Settings"></SidebarContentHeader>

      <SidebarGroup>
        <SidebarGroupContent>
          <EditPageSettingsGeneral
            initialValues={{
              metaTitle: pageSettings?.metaTitle ?? '',
              pageSlug: pageSettings?.slug ?? '',
              published: pageSettings?.publishedAt ? true : false,
            }}
            pageId={pageSettings?.id ?? ''}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
