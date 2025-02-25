import { captureException } from '@sentry/node';

export async function takeScreenshot(url: string) {
  try {
    const response = await fetch(
      `https://api.screenshotapi.com/take?apiKey=${process.env.SCREENSHOT_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
        }),
      }
    );

    const data = await response.json();

    const imageUrl = data.outputUrl;

    return imageUrl;
  } catch (error) {
    captureException(error);
    return null;
  }
}
