import { useSidebar } from '@/app/components/ui/sidebar';
import { useEditModeContext } from '@/app/contexts/Edit';

import { Blocks } from '@/lib/blocks/types';

export const config: Record<
  Blocks,
  {
    title: string;
    label: string;
    icon: string;
    drag: {
      h: number;
      w: number;
    };
  }
> = {
  header: {
    title: 'Header',
    label: 'A primary title and optional subtitle',
    icon: '/assets/ui/type-header.svg',
    drag: {
      w: 12,
      h: 6,
    },
  },
  content: {
    title: 'Content',
    label: 'A block of text',
    icon: '/assets/ui/type-content.svg',
    drag: {
      w: 12,
      h: 6,
    },
  },
  image: {
    title: 'Image',
    label: 'Nothing more, nothing less',
    icon: '/assets/ui/type-image.svg',
    drag: {
      w: 8,
      h: 8,
    },
  },
  stack: {
    title: 'Stack',
    label: 'A list of items',
    icon: '/assets/ui/type-stack.svg',
    drag: {
      w: 6,
      h: 8,
    },
  },
  'github-commits-this-month': {
    title: 'Github Commits (month)',
    label: 'The number of commits this month for a user',
    icon: '/assets/ui/type-github-commits-this-month.svg',
    drag: {
      w: 6,
      h: 6,
    },
  },
  'spotify-playing-now': {
    title: 'Spotify Playing Now',
    label: 'The song you are currently playing on Spotify',
    icon: '/assets/ui/type-spotify-playing-now.svg',
    drag: {
      w: 12,
      h: 4,
    },
  },
  'spotify-embed': {
    title: 'Spotify Embed',
    label: 'Embed a Spotify playlist or song',
    icon: '/assets/ui/type-spotify-playing-now.svg',
    drag: {
      w: 12,
      h: 4,
    },
  },
  'instagram-latest-post': {
    title: 'Latest Instagram post',
    label: 'The latest post from your connected Instagram account',
    icon: '/assets/ui/type-instagram-latest-post.svg',
    drag: {
      w: 12,
      h: 4,
    },
  },
  map: {
    title: 'Map',
    label: 'A map with a pin',
    icon: '/assets/ui/type-map.svg',
    drag: {
      w: 12,
      h: 6,
    },
  },
  'link-box': {
    title: 'Link Box',
    label: 'Display a nicely formatted link',
    icon: '/assets/ui/type-link-box.svg',
    drag: {
      w: 12,
      h: 2,
    },
  },
  'link-bar': {
    title: 'Link Bar',
    label: 'A row of links to social media',
    icon: '/assets/ui/type-link-bar.svg',
    drag: {
      w: 12,
      h: 2,
    },
  },
  'waitlist-email': {
    title: 'GetWaitlist Email',
    label: 'A form to collect emails for your getwaitlist.com project',
    icon: '/assets/ui/type-waitlist-email.svg',
    drag: {
      w: 12,
      h: 5,
    },
  },
};

interface Props {
  type: Blocks;
}

export function DraggableBlockButton({ type }: Props) {
  const { setDraggingItem, setNextToAddBlock } = useEditModeContext();

  const { isMobile, setOpen } = useSidebar();

  const blockConfig = config[type];

  const content = (
    <>
      <img
        src="/assets/ui/drag.svg"
        className="mr-3 hidden md:block"
        width={9}
        height={15}
        alt=""
      />
      <div className="w-9 h-9 bg-stone-100 rounded-md flex items-center mr-3 flex-shrink-0">
        <img src={blockConfig.icon} className="w-9 h-9" alt="" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-stone-900 text-sm">
          {blockConfig.title}
        </span>
        <span className="text-xs text-slate-600">{blockConfig.label}</span>
      </div>
    </>
  );

  return (
    <>
      <button
        id="hello"
        type="button"
        className="hidden md:flex w-full bg-white border border-stone-200 rounded-md  items-center justify-start text-left px-3 py-3 shadow-none hover:shadow-md transition-shadow cursor-move"
        draggable={true}
        unselectable="on"
        onDragStart={(e) => {
          // This is needed to make the drag work in Firefox
          e.dataTransfer.setData('text/plain', '');

          setDraggingItem({
            i: 'tmp-block',
            w: blockConfig.drag.w,
            h: blockConfig.drag.h,
            type,
          });
        }}
      >
        {content}
      </button>
      <button
        type="button"
        className="flex md:hidden w-full bg-white border border-stone-200 rounded-md items-center justify-start text-left px-3 py-3 shadow-none hover:shadow-md transition-shadow"
        onClick={() => {
          setNextToAddBlock({
            i: 'tmp-block',
            w: blockConfig.drag.w,
            h: blockConfig.drag.h,
            type,
          });

          if (isMobile && setOpen) {
            setOpen(false);
          }
        }}
      >
        {content}
      </button>
    </>
  );
}
