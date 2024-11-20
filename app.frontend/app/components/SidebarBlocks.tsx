import { DraggableBlockButton } from '@/app/components/DraggableBlockButton';
import {
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
  SidebarMenu,
} from '@/app/components/ui/sidebar';
import { internalApiFetcher } from '@/lib/fetch';
import { Blocks } from '@tryglow/blocks';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export function SidebarBlocks() {
  const [search, setSearch] = useState('');

  const { data: enabledBlocks } = useSWR<Blocks[]>(
    `/blocks/enabled-blocks`,
    internalApiFetcher
  );

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
