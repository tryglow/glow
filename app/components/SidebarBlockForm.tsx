import { config } from '@/app/components/DraggableBlockButton';
import { EditForm } from '@/app/components/EditForm';
import {
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
} from '@/app/components/ui/sidebar';
import { useEditModeContext } from '@/app/contexts/Edit';

export function SidebarBlockForm({ onClose }: { onClose: () => void }) {
  const { currentEditingBlock } = useEditModeContext();

  if (!currentEditingBlock) return null;

  return (
    <>
      <SidebarContentHeader
        title={`Editing ${config[currentEditingBlock.type].title}`}
      />
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="pb-2"></div>
          <EditForm
            onClose={onClose}
            blockId={currentEditingBlock?.id}
            blockType={currentEditingBlock?.type}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
