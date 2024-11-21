const key = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API
export const allFonts = async () => {
  try {
    const resp = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${key}`);
    
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const data = await resp.json();
    
    return data

  } catch (error) {
    console.error('Error fetching Google Fonts:', error);
  }
}