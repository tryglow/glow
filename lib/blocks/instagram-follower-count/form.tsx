import { EditFormProps } from '../types';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { captureException } from '@sentry/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { InstagramFollowerCountBlockConfig } from './config';
import { InitialDataUsersIntegrations } from '@/app/[domain]/[slug]/page';
import { FormikHelpers } from 'formik';

const InstagramLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 132.004 132"
      width={32}
      height={32}
    >
      <defs>
        <radialGradient
          xlinkHref="#a"
          id="c"
          cx="158.429"
          cy="578.088"
          r="65"
          fx="158.429"
          fy="578.088"
          gradientTransform="matrix(0 -1.98198 1.8439 0 -1031.402 454.004)"
          gradientUnits="userSpaceOnUse"
        />
        <radialGradient
          xlinkHref="#b"
          id="d"
          cx="147.694"
          cy="473.455"
          r="65"
          fx="147.694"
          fy="473.455"
          gradientTransform="matrix(.17394 .86872 -3.5818 .71718 1648.348 -458.493)"
          gradientUnits="userSpaceOnUse"
        />
        <linearGradient id="b">
          <stop offset="0" stopColor="#3771c8" />
          <stop offset=".128" stopColor="#3771c8" />
          <stop offset="1" stopColor="#60f" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="a">
          <stop offset="0" stopColor="#fd5" />
          <stop offset=".1" stopColor="#fd5" />
          <stop offset=".5" stopColor="#ff543e" />
          <stop offset="1" stopColor="#c837ab" />
        </linearGradient>
      </defs>
      <path
        fill="url(#c)"
        d="M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z"
        transform="translate(1.004 1)"
      />
      <path
        fill="url(#d)"
        d="M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z"
        transform="translate(1.004 1)"
      />
      <path
        fill="#fff"
        d="M66.004 18c-13.036 0-14.672.057-19.792.29-5.11.234-8.598 1.043-11.65 2.23-3.157 1.226-5.835 2.866-8.503 5.535-2.67 2.668-4.31 5.346-5.54 8.502-1.19 3.053-2 6.542-2.23 11.65C18.06 51.327 18 52.964 18 66s.058 14.667.29 19.787c.235 5.11 1.044 8.598 2.23 11.65 1.227 3.157 2.867 5.835 5.536 8.503 2.667 2.67 5.345 4.314 8.5 5.54 3.054 1.187 6.543 1.996 11.652 2.23 5.12.233 6.755.29 19.79.29 13.037 0 14.668-.057 19.788-.29 5.11-.234 8.602-1.043 11.656-2.23 3.156-1.226 5.83-2.87 8.497-5.54 2.67-2.668 4.31-5.346 5.54-8.502 1.18-3.053 1.99-6.542 2.23-11.65.23-5.12.29-6.752.29-19.788 0-13.036-.06-14.672-.29-19.792-.24-5.11-1.05-8.598-2.23-11.65-1.23-3.157-2.87-5.835-5.54-8.503-2.67-2.67-5.34-4.31-8.5-5.535-3.06-1.187-6.55-1.996-11.66-2.23-5.12-.233-6.75-.29-19.79-.29zm-4.306 8.65c1.278-.002 2.704 0 4.306 0 12.816 0 14.335.046 19.396.276 4.68.214 7.22.996 8.912 1.653 2.24.87 3.837 1.91 5.516 3.59 1.68 1.68 2.72 3.28 3.592 5.52.657 1.69 1.44 4.23 1.653 8.91.23 5.06.28 6.58.28 19.39s-.05 14.33-.28 19.39c-.214 4.68-.996 7.22-1.653 8.91-.87 2.24-1.912 3.835-3.592 5.514-1.68 1.68-3.275 2.72-5.516 3.59-1.69.66-4.232 1.44-8.912 1.654-5.06.23-6.58.28-19.396.28-12.817 0-14.336-.05-19.396-.28-4.68-.216-7.22-.998-8.913-1.655-2.24-.87-3.84-1.91-5.52-3.59-1.68-1.68-2.72-3.276-3.592-5.517-.657-1.69-1.44-4.23-1.653-8.91-.23-5.06-.276-6.58-.276-19.398s.046-14.33.276-19.39c.214-4.68.996-7.22 1.653-8.912.87-2.24 1.912-3.84 3.592-5.52 1.68-1.68 3.28-2.72 5.52-3.592 1.692-.66 4.233-1.44 8.913-1.655 4.428-.2 6.144-.26 15.09-.27zm29.928 7.97c-3.18 0-5.76 2.577-5.76 5.758 0 3.18 2.58 5.76 5.76 5.76 3.18 0 5.76-2.58 5.76-5.76 0-3.18-2.58-5.76-5.76-5.76zm-25.622 6.73c-13.613 0-24.65 11.037-24.65 24.65 0 13.613 11.037 24.645 24.65 24.645C79.617 90.645 90.65 79.613 90.65 66S79.616 41.35 66.003 41.35zm0 8.65c8.836 0 16 7.163 16 16 0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16 0-8.837 7.163-16 16-16z"
      />
    </svg>
  );
};

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId,
}: EditFormProps<InstagramFollowerCountBlockConfig>) {
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);
  const { data: usersIntegrations } = useSWR<InitialDataUsersIntegrations
  >(
    '/api/user/integrations'
  );

  const { mutate } = useSWRConfig();

  const instagramIntegrations = usersIntegrations?.filter(
    (integration) => integration.type === 'instagram'
  );

  const handleDisconnect = async () => {
    if (!instagramIntegrations || instagramIntegrations?.length === 0) {
      return;
    }

    try {
      const response = await fetch('/api/services/disconnect', {
        method: 'POST',
        body: JSON.stringify({
          integrationId: instagramIntegrations[0].id,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Integration disconnected',
        });

        mutate('/api/user/integrations');
      }
    } catch (error) {
      captureException(error);
      toast({
        title: 'Error disconnecting integration',
        description: 'Please try again later.',
      });
    }
  };

  const onSubmit = async (
    values: InstagramFollowerCountBlockConfig,
    { setSubmitting }: FormikHelpers<InstagramFollowerCountBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  if (!instagramIntegrations || instagramIntegrations?.length === 0) {
    return (
      <div className="bg-stone-100 rounded-md flex flex-col items-center text-center px-4 py-8">
        <div className="bg-stone-200 rounded-md w-14 h-14 flex items-center justify-center">
          <InstagramLogo />
        </div>
        <span className="font-medium text-lg text-stone-800 mt-3">
          Connect your Instagram Account
        </span>
        <span className="font-normal text-stone-600 mt-1">
          To get started, you&apos;ll need to connect your Instagram account to
          your page.
        </span>

        <Button asChild className="mt-4">
          <Link href="/api/services/instagram" prefetch={false} target="_blank">
            Connect Instagram
          </Link>
        </Button>
      </div>
    );
  }

  const connectedSince = instagramIntegrations[0].createdAt;

  return (
    <>
      <div className="bg-stone-100 rounded-md flex flex-col items-center text-center px-4 py-8">
        <div className="bg-stone-200 rounded-md w-14 h-14 flex items-center justify-center">
          <InstagramLogo />
        </div>
        <span className="font-medium text-lg text-stone-800 mt-3">
          Connected
        </span>
        <span className="font-normal text-stone-600 mt-1">
          Your Instagram account was connected on{' '}
          {new Date(connectedSince).toLocaleDateString()}
        </span>

        {!showConfirmDisconnect && (
          <Button
            onClick={() => setShowConfirmDisconnect(true)}
            className="mt-4"
          >
            Disconnect Account
          </Button>
        )}
        {showConfirmDisconnect && (
          <div className="flex gap-2 mt-4">
            <Button onClick={handleDisconnect}>Are you sure?</Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDisconnect(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
