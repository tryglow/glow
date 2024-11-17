import { setPageTheme } from '@/app/api/themes/actions';
import { CreateEditThemeForm } from '@/app/components/EditPageSettingsDialog/CreateNewTheme';
import { PageThemePreview } from '@/app/components/PageThemePreview';
import { Button } from '@/app/components/ui/button';
import {
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
} from '@/app/components/ui/sidebar';
import { toast } from '@/app/components/ui/use-toast';
import { fetcher } from '@/lib/fetch';
import { themeColorToCssValue } from '@/lib/theme';
import { Theme } from '@tryglow/prisma';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export function SidebarThemes() {
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const { data: currentTeamThemes } = useSWR<Theme[]>('/api/themes', fetcher);

  const params = useParams();

  const [editThemeId, setEditThemeId] = useState<string | null>(null);
  const [showCreateNewTheme, setShowCreateNewTheme] = useState(false);

  const previewThemeValues = currentTeamThemes?.find(
    (theme) => theme.id === previewTheme
  );

  const handleSetPageTheme = async (themeId: string) => {
    if (!params.slug) {
      return;
    }

    const res = await setPageTheme(params.slug as string, themeId);

    if (res.error) {
      toast({
        title: 'Error',
        description: res.error,
      });
    } else {
      toast({
        title: 'Theme updated',
        description: 'We updated the theme for this page',
      });

      mutate(`/api/pages/${params.slug}/theme`);
    }
  };

  return (
    <>
      <SidebarContentHeader title="Themes" />
      <SidebarGroup>
        <SidebarGroupContent className="px-2">
          <div className="grid grid-cols-2 gap-4">
            {currentTeamThemes?.map((theme) => {
              return (
                <div className="flex flex-col gap-1" key={theme.id}>
                  <button
                    onClick={() => {
                      setEditThemeId(null);
                      setShowCreateNewTheme(false);
                      handleSetPageTheme(theme.id);
                    }}
                  >
                    <PageThemePreview themeValues={theme} />
                  </button>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-800">
                      {theme.name}
                    </span>
                    {!theme.isDefault && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs text-indigo-600 px-0"
                        onClick={() => {
                          setEditThemeId(theme.id);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <SidebarSeparator className="my-4" />

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setShowCreateNewTheme(true);
            }}
          >
            <Plus size={16} />
            <span>Create theme</span>
          </Button>

          {editThemeId && (
            <section className="px-4 py-4 bg-stone-100 rounded-lg mt-4">
              <CreateEditThemeForm action="edit" editThemeId={editThemeId} />
            </section>
          )}

          {showCreateNewTheme && !editThemeId && (
            <section className="px-4 py-4 bg-stone-100 rounded-lg mt-4">
              <CreateEditThemeForm
                action="create"
                onCreateSuccess={(newThemeId) => {
                  setShowCreateNewTheme(false);
                  setEditThemeId(newThemeId);
                }}
              />
            </section>
          )}
        </SidebarGroupContent>
      </SidebarGroup>

      {previewTheme &&
        previewThemeValues &&
        !showCreateNewTheme &&
        !editThemeId && (
          <style>
            {`:root {
          --color-sys-bg-base: ${themeColorToCssValue(previewThemeValues.colorBgBase)} !important;
          --color-sys-bg-primary: ${themeColorToCssValue(previewThemeValues.colorBgPrimary)} !important;
          --color-sys-bg-secondary: ${themeColorToCssValue(previewThemeValues.colorBgSecondary)} !important;
          --color-sys-bg-border: ${themeColorToCssValue(previewThemeValues.colorBorderPrimary)} !important;
          
          --color-sys-label-primary: ${themeColorToCssValue(previewThemeValues.colorLabelPrimary)} !important;
          --color-sys-label-secondary: ${themeColorToCssValue(previewThemeValues.colorLabelSecondary)} !important;
          --color-sys-label-tertiary: ${themeColorToCssValue(previewThemeValues.colorLabelTertiary)} !important;
          }`}
          </style>
        )}
    </>
  );
}
