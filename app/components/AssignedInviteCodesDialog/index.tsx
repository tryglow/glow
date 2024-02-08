'use client';

import { InviteCode } from '@prisma/client';
import { CopyIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface Props {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  inviteCodes: InviteCode[];
}

export function AssignedInviteCodesDialog({
  open,
  onOpenChange,
  onClose,
  inviteCodes,
}: Props) {
  const copyTextToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Invite code copied to clipboard',
      });
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Oh no, there was a problem copying the code',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            You&apos;ve been assigned {inviteCodes.length}{' '}
            {inviteCodes.length === 1 ? 'invite code!' : 'invite codes!'}
          </DialogTitle>
          <DialogDescription>
            You can use these codes to invite friends to join Glow.
            <br />
            Use them wisely!
          </DialogDescription>
        </DialogHeader>

        {inviteCodes.map((code) => {
          return (
            <span
              key={code.id}
              className="w-full px-4 py-3 bg-stone-100 rounded-xl font-mono text-sm font-black text-black/70 flex justify-between items-center"
            >
              {code.code}
              <Button
                variant="ghost"
                className="ml-auto"
                onClick={() => copyTextToClipboard(code.code)}
              >
                <span className="sr-only">Copy</span>
                <CopyIcon width={20} />
              </Button>
            </span>
          );
        })}
        <span className="text-sm text-black/40 mt-4">
          Use all of your invites codes, and send us a message on Twitter for
          some limited edition stickers!
        </span>
      </DialogContent>
    </Dialog>
  );
}
