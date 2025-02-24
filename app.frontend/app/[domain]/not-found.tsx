import { auth } from '@/app/lib/auth';
import { LoginWidget } from '@/components/LoginWidget';
import { Button } from '@tryglow/ui';
import Link from 'next/link';

/**
 * This is the 404 page for the profile pages. It is in a higher directory as we
 * also call notFound from the nested layout file.
 */
export default async function NotFoundPage() {
  const session = await auth();

  const user = session?.user;
  return (
    <main className="bg-sys-bg-base">
      <div className="w-full max-w-[768px] mx-auto px-3 md:px-6 gap-3 pt-16 pb-8">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8">
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                404 Page Not Found
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  We couldn&apos;t find the page you were looking for. Want to
                  claim this username?
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            {user ? (
              <Link
                href="/new"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create a page
              </Link>
            ) : (
              <LoginWidget
                trigger={
                  <div className="flex justify-center">
                    <Button size="lg" className="mt-5 mx-auto w-full">
                      Create a page
                    </Button>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
