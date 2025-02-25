'use client';

import { CreatePageForm } from './NewPageForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@tryglow/ui';

interface Props {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export function NewPageDialog({ open, onOpenChange, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create page</DialogTitle>
          <DialogDescription>
            Now just choose where your page should live.
          </DialogDescription>
        </DialogHeader>

        <CreatePageForm onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
