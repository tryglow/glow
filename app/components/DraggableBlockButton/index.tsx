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
    icon: '/ui/type-header.svg',
    drag: {
      w: 12,
      h: 6,
    },
  },
  content: {
    title: 'Content',
    label: 'A block of text',
    icon: '/ui/type-content.svg',
    drag: {
      w: 12,
      h: 6,
    },
  },
  image: {
    title: 'Image',
    label: 'Nothing more, nothing less',
    icon: '/ui/type-image.svg',
    drag: {
      w: 8,
      h: 8,
    },
  },
  stack: {
    title: 'Stack',
    label: 'A list of items',
    icon: '/ui/type-stack.svg',
    drag: {
      w: 6,
      h: 8,
    },
  },
  'github-commits-this-month': {
    title: 'Github Commits (month)',
    label: 'The number of commits this month for a user',
    icon: '/ui/type-github-commits-this-month.svg',
    drag: {
      w: 6,
      h: 6,
    },
  },
  'spotify-playing-now': {
    title: 'Spotify Playing Now',
    label: 'The song you are currently playing on Spotify',
    icon: '/ui/type-spotify-playing-now.svg',
    drag: {
      w: 12,
      h: 4,
    },
  },
  'instagram-latest-post': {
    title: 'Latest Instagram post',
    label: 'The latest post from your connected Instagram account',
    icon: '/ui/type-instagram-latest-post.svg',
    drag: {
      w: 12,
      h: 4,
    },
  },
  map: {
    title: 'Map',
    label: 'A map with a pin',
    icon: '/ui/type-map.svg',
    drag: {
      w: 12,
      h: 6,
    },
  },
  'link-box': {
    title: 'Link Box',
    label: 'Display a nicely formatted link',
    icon: '/ui/type-link-box.svg',
    drag: {
      w: 12,
      h: 2,
    },
  },
};

interface Props {
  type: Blocks;
}

export function DraggableBlockButton({ type }: Props) {
  const { setDraggingItem } = useEditModeContext();

  const blockConfig = config[type];

  return (
    <button
      type="button"
      className="w-full bg-white border border-stone-200 rounded-md flex items-center justify-start text-left px-3 py-3 shadow-none hover:shadow-md transition-shadow cursor-move"
      draggable={true}
      unselectable="on"
      onDragStart={(e) => {
        setDraggingItem({
          i: 'tmp-block',
          w: blockConfig.drag.w,
          h: blockConfig.drag.h,
          type,
        });
      }}
    >
      <img src="/ui/drag.svg" className="mr-3" width={9} height={15}></img>
      <div className="w-9 h-9 bg-stone-100 rounded-md flex items-center mr-3 flex-shrink-0">
        <img src={blockConfig.icon} className="w-9 h-9" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-stone-900 text-sm">
          {blockConfig.title}
        </span>
        <span className="text-xs text-slate-600">{blockConfig.label}</span>
      </div>
    </button>
  );
}
