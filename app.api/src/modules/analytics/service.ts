import { captureException } from '@sentry/node';

export async function fetchStats(pageId: string) {
  try {
    const analyticsResponse = await fetch(
      `https://api.us-west-2.aws.tinybird.co/v0/pipes/page_analytics_stats.json?pageId=${pageId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
        },
      }
    );

    if (!analyticsResponse.ok) {
      return null;
    }

    const analyticsData = await analyticsResponse.json();

    const totalViews = analyticsData.data.reduce(
      (acc: number, curr: any) => acc + curr.total_views,
      0
    );

    const totalUniqueVisitors = analyticsData.data.reduce(
      (acc: number, curr: any) => acc + curr.unique_visitors,
      0
    );

    return {
      totals: {
        views: totalViews,
        uniqueVisitors: totalUniqueVisitors,
      },
      data: analyticsData.data,
    };
  } catch (error) {
    captureException(error);
    return null;
  }
}

export async function fetchTopLocations(pageId: string) {
  try {
    const analyticsResponse = await fetch(
      `https://api.us-west-2.aws.tinybird.co/v0/pipes/page_analytics_locations.json?pageId=${pageId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
        },
      }
    );

    if (!analyticsResponse.ok) {
      return null;
    }

    const analyticsData = await analyticsResponse.json();

    return analyticsData.data;
  } catch (error) {
    captureException(error);
    return null;
  }
}
