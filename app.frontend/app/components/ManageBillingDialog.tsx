import { authClient, useSession } from '@/app/lib/auth';
import { Subscription } from '@better-auth/stripe';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  Button,
} from '@tryglow/ui';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageBillingDialog({ open, onOpenChange }: Props) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const { data } = useSession();

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!data?.session?.activeOrganizationId) return;
      const { data: currentOrgSubscription } =
        await authClient.subscription.list({
          query: {
            referenceId: data?.session?.activeOrganizationId,
          },
        });

      if (currentOrgSubscription?.[0]) {
        setSubscription(currentOrgSubscription?.[0]);
      }
    };
    fetchSubscription();
  }, []);

  const handleUpgrade = async () => {
    await authClient.subscription.upgrade({
      referenceId: data?.session?.activeOrganizationId as string,
      plan: 'premium',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Manage Billing</DialogTitle>
          <DialogDescription>
            Manage your teams billing information.
          </DialogDescription>
        </DialogHeader>

        <section>
          <p className="text-sm text-slate-800 mb-4">
            You are currently on the <strong>{subscription?.plan}</strong> plan.
            Would you like to upgrade to the <strong>Premium</strong> plan?
          </p>
          <Button onClick={handleUpgrade}>Upgrade</Button>
        </section>
      </DialogContent>
    </Dialog>
  );
}
