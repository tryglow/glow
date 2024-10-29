'use client';

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const chartConfig = {
  votes: {
    label: 'Votes',
  },
} satisfies ChartConfig;

export function ChartMockup({
  className,
  voteCount,
}: {
  className?: string;
  voteCount?: number;
}) {
  const chartData = [{ votes: voteCount ?? 0, fill: '#DA552F' }];
  const goal = 50;
  return (
    <Card className={cn('flex flex-col rounded-[1.3rem] shadow-sm', className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>
          <Link
            href={`https://www.producthunt.com/posts/glow-6c09d7c4-ece2-4466-b8ed-c17542f44294`}
            target="_blank"
            className="flex items-center gap-1"
          >
            ProductHunt Launch <ArrowUpRight className="w-4 h-4" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={360 * (chartData[0].votes / goal)}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="votes" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].votes.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Upvotes (live)
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Goal: {goal} upvotes
        </div>
      </CardFooter>
    </Card>
  );
}
