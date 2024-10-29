import 'server-only';

import { ChartMockup } from '@/app/i/landing-page/chart-mockup';

const fetchData = async () => {
  const res = await fetch('https://api.producthunt.com/v2/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PRODUCTHUNT_API_TOKEN}`,
    },
    next: {
      revalidate: 60,
    },
    body: JSON.stringify({
      query: `query {
        post(slug: "glow-6c09d7c4-ece2-4466-b8ed-c17542f44294") {
          votesCount
        }
      }`,
    }),
  });
  return res.json();
};

export async function ProductHuntChart({ className }: { className?: string }) {
  const { data } = await fetchData();

  return (
    <ChartMockup className={className} voteCount={data?.post?.votesCount} />
  );
}
