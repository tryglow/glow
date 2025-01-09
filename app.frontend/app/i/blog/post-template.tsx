import { MarketingContainer } from '@/app/components/MarketingContainer';
import { ArticleMetadata } from '@/types/mdx';

interface Props {
  children: React.ReactNode;
  meta: ArticleMetadata;
}

type Author = {
  id: 'alex' | 'jack';
  name: string;
  position: string;
  avatar: string;
  link: string;
  glowLink: string;
  glowUsername: string;
};

export const authors: Author[] = [
  {
    id: 'alex',
    name: 'Alex',
    position: 'Founder',
    avatar:
      'https://cdn.glow.as/block-f5a2d44d-6933-4a51-a9e2-9fbb27923585/f4fdd080-46be-483f-9b04-e5646efb157d',
    link: 'https://x.com/alexjpate',
    glowUsername: 'alex',
    glowLink: 'https://alex.now',
  },
  {
    id: 'jack',
    name: 'Jack',
    position: 'Co-founder',
    avatar:
      'https://cdn.glow.as/666b7445-c171-4ad7-a21d-eb1954b7bd40/0885d7ec-9af4-4430-94f4-ad1a033c2704',
    link: 'https://x.com/tryglow',
    glowUsername: 'jack',
    glowLink: 'https://glow.as/jack',
  },
];

export function ArticleTemplate({ children, meta }: Props) {
  const author = authors.find((author) => author.id === meta.author);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    author: {
      '@type': 'Person',
      name: author?.name,
      url: author?.link,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Glow',
      logo: {
        '@type': 'ImageObject',
        url: 'https://glow.as/assets/logo.png',
      },
    },
    datePublished: meta.publishDate,
    dateModified: meta.publishDate,
  };

  return (
    <>
      <article>
        <div className="bg-gradient-to-b from-[#bbb5ff] to-[#f4cbdc]">
          <MarketingContainer>
            <header className="flex max-w-4xl flex-col pt-16 pb-16">
              <h1 className="text-pretty text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                {meta.title}
              </h1>
              <p className="mt-6 text-sm font-semibold text-stone-800">
                by {author?.name} on{' '}
                <time
                  dateTime={meta.publishDate}
                  className="order-first text-sm text-stone-800 mb-3"
                >
                  {Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(meta.publishDate))}
                </time>
              </p>
            </header>
          </MarketingContainer>
        </div>
        <MarketingContainer>
          <div className="prose prose-lg max-w-3xl pt-16">{children}</div>
        </MarketingContainer>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />
    </>
  );
}
