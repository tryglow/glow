'use client';

import { FormField } from '../FormField';
import { createTeamInvite } from './actions';
import { teamInviteSchema } from './shared';
import { captureException } from '@sentry/nextjs';
import { Invitation, User } from '@tryglow/prisma';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  useToast,
} from '@tryglow/ui';
import { Form, Formik, FormikHelpers } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type TeamInviteFormValues = {
  email: string;
};

interface Props {
  onCancel: () => void;
  members: { user: Partial<User> }[];
  invites?: Partial<Invitation>[];
}

export function EditTeamSettingsMembers({ onCancel, members, invites }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (
    values: TeamInviteFormValues,
    { setSubmitting, setFieldError }: FormikHelpers<TeamInviteFormValues>
  ) => {
    setSubmitting(true);

    try {
      const response = await createTeamInvite(values);

      if (response?.error) {
        toast({
          variant: 'error',
          title: 'Something went wrong',
          description: response.error.message,
        });

        return;
      }

      toast({
        title: 'Invite sent',
        description: 'We sent an invite to ' + values.email,
      });
      router.refresh();
      onCancel();
    } catch (error) {
      captureException(error);
      toast({
        variant: 'error',
        title: 'Something went wrong',
        description: 'Sorry, there was a problem sending the invite',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <table className="min-w-full divide-y divide-gray-300">
        <tbody className="divide-y divide-gray-200 bg-white">
          {members.map((member) => {
            return (
              <tr key={member.user.id}>
                <td className="whitespace-nowrap py-3 pr-3 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {member.user.image && (
                      <AvatarImage
                        src={member.user.image}
                        alt={member.user.name ?? ''}
                      />
                    )}
                    <AvatarFallback>
                      {member.user.name?.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm font-medium text-slate-900">
                      {member.user.email || member.user.name}
                    </span>
                  </div>
                </td>

                <td className="whitespace-nowrap text-right px-3 py-3">
                  <span className="bg-green-200 tracking-tight font-bold text-xs uppercase rounded-sm px-1.5 py-0.5 text-green-700">
                    Admin
                  </span>
                </td>
              </tr>
            );
          })}
          {invites?.map((invite) => {
            return (
              <tr key={invite.id}>
                <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-slate-600">
                  {invite.email}
                </td>
                <td className="whitespace-nowrap text-right px-3 py-4">
                  <span className="bg-yellow-300 tracking-tight font-bold text-xs uppercase rounded-sm px-1.5 py-0.5 text-yellow-800">
                    Invited
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <section className="border-t border-slate-200 pt-6">
        <h3 className="text-base font-medium leading-6 text-slate-900">
          Invite a team member
        </h3>
        <p className="text-sm text-slate-500">
          Send an invite by entering their email address below.
        </p>

        <Formik
          initialValues={{
            email: '',
          }}
          validate={withZodSchema(teamInviteSchema)}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue, errors }) => (
            <Form className="w-full flex flex-col mt-4">
              <div>
                <FormField
                  label="Email"
                  name="email"
                  placeholder="hey@glow.as"
                  id="email"
                  error={errors.email}
                />
              </div>

              <div>
                <Button type="submit">
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Invite
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
}
