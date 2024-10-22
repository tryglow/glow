import { DraggableBlockButton } from '@/app/components/DraggableBlockButton';
import {
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
  SidebarMenu,
} from '@/app/components/ui/sidebar';
import { Blocks } from '@/lib/blocks/types';
import { useEffect, useState } from 'react';

const blocks: Blocks[] = [
  'header',
  'content',
  'link-box',
  'link-bar',
  'stack',
  'instagram-latest-post',
  'image',
  'map',
  'github-commits-this-month',
  'spotify-playing-now',
  'spotify-embed',
  'waitlist-email',
];

export function SidebarBlocks() {
  const [search, setSearch] = useState('');

  const [filteredBlocks, setFilteredBlocks] = useState(blocks);

  useEffect(() => {
    if (search === '') {
      setFilteredBlocks(blocks);
    }

    setFilteredBlocks(
      blocks.filter((block) => block.includes(search.toLowerCase()))
    );
  }, [search]);

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
                {filteredBlocks.map((block) => {
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
