import { MarketingContainer } from '@/components/MarketingContainer';
import { LearnPostMetadata } from '@/types/mdx';

interface Props {
  children: React.ReactNode;
  meta: LearnPostMetadata;
}

export function ArticleTemplate({ children, meta }: Props) {
  return (
    <article itemScope itemType="https://schema.org/FAQPage">
      <div
        itemScope
        itemProp="mainEntity"
        itemType="https://schema.org/Question"
        className="flex flex-col min-h-[calc(100vh-12rem)]"
      >
        <section className="bg-gradient-to-b from-[#f6dc99] to-[#ffc0af] pb-16">
          <MarketingContainer>
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <header className="flex max-w-4xl flex-col pt-16">
                <h1
                  itemProp="name"
                  className="mt-6 text-pretty text-5xl lg:text-6xl font-black text-black tracking-tight"
                >
                  {meta.title}
                </h1>
                <time
                  dateTime={meta.publishDate}
                  className="order-first text-sm text-stone-800"
                >
                  {Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(meta.publishDate))}
                </time>
              </header>
            </div>
          </MarketingContainer>
        </section>
        <section className="py-8 flex-1">
          <MarketingContainer>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text" className="prose prose-lg max-w-3xl">
                {children}
              </div>
            </div>
          </MarketingContainer>
        </section>
      </div>
    </article>
  );
}
