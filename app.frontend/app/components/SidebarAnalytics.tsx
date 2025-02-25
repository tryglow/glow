import { InternalApi } from '@/app/lib/api';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
  Card,
  CardContent,
  Skeleton,
} from '@tryglow/ui';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { useSWRConfig } from 'swr';

const dataPoints = [
  {
    name: 'Unique visitors',
    key: 'unique_visitors',
    description: 'Showing unique visitors for the last 7 days',
  },
  {
    name: 'Page views',
    key: 'total_views',
    description: 'Showing total views for the last 7 days',
  },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function SidebarAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<{
    totals: {
      total_views: number;
      unique_visitors: number;
    };
    data: { date: string; total_views: number; unique_visitors: number }[];
  }>({
    totals: {
      total_views: 0,
      unique_visitors: 0,
    },
    data: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const { cache } = useSWRConfig();
  const pageId = cache.get('pageId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await InternalApi.get(`/analytics/pages/${pageId}`);
        setAnalyticsData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pageId]);

  return (
    <>
      <SidebarContentHeader title="Analytics"></SidebarContentHeader>

      <SidebarGroup>
        <SidebarGroupContent>
          {dataPoints.map((dataPoint) => (
            <div key={dataPoint.key}>
              <Card className="shadow-none mb-4">
                <CardContent>
                  <div className="flex flex-col gap-0 mt-4 mb-4">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">
                          {dataPoint.key === 'total_views'
                            ? analyticsData.totals.total_views
                            : analyticsData.totals.unique_visitors}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {dataPoint.name}
                        </span>
                      </>
                    )}
                  </div>
                  <ChartContainer config={chartConfig}>
                    {isLoading ? (
                      <div className="h-[120px] flex items-center justify-center">
                        <Skeleton className="h-[100px] w-full" />
                      </div>
                    ) : (
                      <AreaChart accessibilityLayer data={analyticsData.data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                          dataKey={dataPoint.key}
                          type="natural"
                          fillOpacity={0.4}
                        />
                      </AreaChart>
                    )}
                  </ChartContainer>
                  <span className="text-xs text-neutral-500 block">
                    {dataPoint.description}
                  </span>
                </CardContent>
              </Card>
            </div>
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}

export function SidebarAnalyticsComingsoon() {
  return (
    <>
      <SidebarContentHeader title="Analytics"></SidebarContentHeader>

      <SidebarGroup>
        <SidebarGroupContent>
          <div className="w-full aspect-square bg-stone-200 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              Available soon
            </span>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
