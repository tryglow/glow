import { Metadata } from 'next';
import Link from 'next/link';

import { MarketingContainer } from '@/app/components/MarketingContainer';

import { LearnPost } from '@/app/i/learn/utils';
import { getLearnPosts } from './utils';

export const metadata: Metadata = {
  title: 'Learn - Glow',
};

export default async function LearnLandingPage() {
  const learnPosts = await getLearnPosts();

  return (
    <main>
      <div className="w-full flex-auto bg-gradient-to-b from-[#f6dc99] to-[#ffc0af]">
        <MarketingContainer>
          <div className="mx-auto max-w-2xl lg:max-w-none pt-32 pb-16">
            <div>
              <h1>
                <span className="text-pretty text-5xl lg:text-6xl font-black text-black tracking-tight">
                  Learn
                </span>
              </h1>
              <div className="mt-6 max-w-3xl text-xl text-slate-900">
                <p>Common questions and answers about link-in-bio.</p>
              </div>
            </div>
          </div>
        </MarketingContainer>
      </div>
      <MarketingContainer className="pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {learnPosts.map((post: LearnPost) => {
            return (
              <div key={post.slug}>
                <article>
                  <h2 className="font-display text-2xl font-semibold text-slate-800">
                    <Link href={`/i/learn/${post.slug}`}>{post.title}</Link>
                  </h2>
                </article>
              </div>
            );
          })}
        </div>
      </MarketingContainer>
    </main>
  );
}
