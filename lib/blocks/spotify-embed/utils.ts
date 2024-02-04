export async function fetchData(spotifyAssetUrl: string) {
  try {
    const req = await fetch(
      `https://open.spotify.com/oembed?url=${spotifyAssetUrl}`,
      {
        method: 'GET',
      }
    );

    const data = await req.json();

    if (data.error) {
      console.log('Issue fetching Spotify data', data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.log('Issue fetching Spotify data', error);
    return null;
  }
}
