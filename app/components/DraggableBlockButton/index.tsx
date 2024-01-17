import {useEditModeContext} from '@/app/contexts/Edit';
import {Blocks} from '@/lib/blocks/types';

const config: Record<
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
  stack: {
    title: 'Stack',
    label: 'A list of items',
    icon: '/ui/type-stack.svg',
    drag: {
      w: 5,
      h: 9,
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
};

interface Props {
  type: Blocks;
}

export function DraggableBlockButton({type}: Props) {
  const {setDraggingItem} = useEditModeContext();

  const blockConfig = config[type];

  return (
    <button
      type="button"
      className="w-full bg-white border border-stone-200 rounded-md flex items-center justify-start text-left px-3 py-3 shadow-none hover:shadow-md transition-shadow cursor-move"
      draggable={true}
      unselectable="on"
      onDragStart={(e) => {
        setDraggingItem({
          // TODO - use a real ID
          i: 'another-item',
          w: blockConfig.drag.w,
          h: blockConfig.drag.h,
          type,
        });
      }}
    >
      <img src="/ui/drag.svg" className="mr-3"></img>
      <div className="w-9 h-9 bg-gray-200 rounded-md flex items-center mr-3">
        <img
          src={blockConfig.icon}
          className="w-9 h-9 flex-1 flex-shrink-0 mr-3"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-sm">{blockConfig.title}</span>
        <span className="text-xs text-slate-600">{blockConfig.label}</span>
      </div>
    </button>
  );
}
