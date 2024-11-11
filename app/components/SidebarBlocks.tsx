import { DraggableBlockButton } from '@/app/components/DraggableBlockButton';
import {
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
  SidebarMenu,
} from '@/app/components/ui/sidebar';
import { Blocks } from '@/lib/blocks/types';
import { fetcher } from '@/lib/fetch';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export function SidebarBlocks() {
  const [search, setSearch] = useState('');

  const { data: enabledBlocks } = useSWR<Blocks[]>(
    '/api/blocks/enabled-blocks',
    fetcher
  );

  !enabledBlocks?.includes('accordion') && enabledBlocks?.push('accordion')
  const [filteredBlocks, setFilteredBlocks] = useState(enabledBlocks);

  useEffect(() => {
    if (search === '') {
      setFilteredBlocks(enabledBlocks);
    }

    if (enabledBlocks) {
      setFilteredBlocks(
        enabledBlocks.filter((block) => block.includes(search.toLowerCase()))
      );
    }
  }, [search, enabledBlocks]);

  return (
    <>
      <SidebarContentHeader title="Blocks">
        <SidebarInput
          placeholder="Filter blocks"
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
          className="mt-2"
        />
      </SidebarContentHeader>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <div className="overflow-y-auto overscroll-none">
              <div className="space-y-2 flex flex-col" id="tour-blocks">
                {filteredBlocks?.map((block) => {
                  return <DraggableBlockButton key={block} type={block} />;
                })}
              </div>
            </div>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
