import { useEffect, useState } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { DraggableBlockButton } from '../DraggableBlockButton';

const BlockIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 62 62"
      width={20}
      fill="none"
    >
      <path
        fill="#000"
        d="M52.39 8.05C49.52 3.08 44.18 0 38.45 0H23.56C17.83 0 12.48 3.08 9.62 8.05l-7.45 12.9c-2.869998 4.97-2.869998 11.14 0 16.1l7.45 12.9C12.49 54.92 17.83 58 23.56 58h14.89c5.73 0 11.08-3.08 13.94-8.05l7.45-12.9c2.87-4.97 2.87-11.14 0-16.1l-7.45-12.9ZM17.71 48.88l-.72.75-.72-.75c-.58-.61-1.08-1.26-1.47-1.93l-7.45-12.9c-1.8-3.12-1.8-6.99 0-10.1l7.45-12.9c.39-.68.89-1.33 1.47-1.94l.72-.75.72.74c.58.6 1.08 1.26 1.48 1.94l7.45 12.9c1.8 3.12 1.8 6.99 0 10.1l-7.45 12.9c-.38.67-.87 1.3-1.48 1.93v.01ZM54.87 33.6c-.07.15-.14.3-.23.45l-7.45 12.9c-1.8 3.12-5.15 5.05-8.75 5.05H23.1l1.08-1.72.21-.33 7.45-12.9c.76-1.32 1.33-2.76 1.7-4.28l.18-.77h21.93l-.78 1.6ZM33.72 26l-.18-.77c-.36-1.52-.94-2.97-1.7-4.28l-7.45-12.9c-.05-.09-.11-.18-.17-.27-.06-.08-.11-.17-.17-.25L23.08 6h15.36c3.6 0 6.95 1.94 8.75 5.05l7.45 12.9c.08.15.15.29.22.44l.79 1.61H33.72Z"
      />
    </svg>
  );
};

export function BlockSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => (document.body.style.pointerEvents = ''), 0);
    }
  }, [open]);
  return (
    <>
      <div
        className="fixed h-screen w-60 bg-gradient-to-r from-transparent to-black/10 right-0 top-0 flex items-center justify-center"
        onMouseOver={() => setOpen(true)}
        // onMouseLeave={() => setOpen(false)}
      >
        <div className="text-black font-4xl font-bold">+ New block</div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent hideOverlay>
            <SheetHeader className="border-b border-stone-200 pb-2 mb-4">
              <SheetTitle className="flex items-center gap-2">
                <BlockIcon />
                Add Blocks
              </SheetTitle>
            </SheetHeader>
            <SheetDescription>
              <div
                className="overflow-y-auto h-auto"
                style={{ maxHeight: 'calc(100vh - 90px)' }}
              >
                <div className="space-y-3 flex flex-col">
                  <DraggableBlockButton type="header" />
                  <DraggableBlockButton type="content" />
                  <DraggableBlockButton type="stack" />
                  <DraggableBlockButton type="image" />
                  <DraggableBlockButton type="map" />
                  <DraggableBlockButton type="github-commits-this-month" />
                  <DraggableBlockButton type="spotify-playing-now" />
                  <DraggableBlockButton type="instagram-latest-post" />
                  <DraggableBlockButton type="link-box" />
                </div>
              </div>
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
