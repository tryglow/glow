import {useEditModeContext} from '@/app/contexts/Edit';
import {Blocks} from '@/lib/blocks/types';

const config: Record<Blocks, {title: string; label: string; icon: string}> = {
  header: {
    title: 'Header',
    label: 'A primary title and optional subtitle',
    icon: '/ui/type-header.svg',
  },
  content: {
    title: 'Content',
    label: 'A block of text',
    icon: '/ui/type-content.svg',
  },
  stack: {
    title: 'Stack',
    label: 'A list of items',
    icon: '/ui/type-stack.svg',
  },
  'github-commits-this-month': {
    title: 'Github Commits (month)',
    label: 'The number of commits this month for a user',
    icon: '/ui/type-github-commits-this-month.svg',
  },
};

interface Props {
  type: Blocks;
}

export function DraggableBlockButton({type}: Props) {
  const {setDraggingItem} = useEditModeContext();

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
          w: 12,
          h: 6,
          type,
        });
      }}
    >
      <img src="/ui/drag.svg" className="mr-3"></img>
      <div className="w-9 h-9 bg-gray-200 rounded-md flex items-center mr-3">
        <img
          src={config[type].icon}
          className="w-9 h-9 flex-1 flex-shrink-0 mr-3"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-sm">{config[type].title}</span>
        <span className="text-xs text-slate-600">{config[type].label}</span>
      </div>
    </button>
  );
}
