import * as Yup from 'yup';

export interface ContentBlockConfig {
  title: string;
  content: string;
}

export const defaults: ContentBlockConfig = {
  title: 'About',
  content:
    "So I don't have no time, I don't even have a minute to waste… I feel like every second of my life, I've got to find a way to keep motivating people before it's too late.",
};

export const ContentSchema = Yup.object().shape({
  pageSlug: Yup.string(),
  content: Yup.string().required('Please provide some content'),
  contentStyles: Yup.object()
});

export type FontColorType = {
  r: string;
  g: string;
  b: string;
  a: string;
}

export type TextStylingType = {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  // color: FontColorType;
  color: string;
  letterSpacing: string;
  lineHeight: string;
};

export type blockStyleType = {
  transform: string
}

export type TextStyles = {
  blockId: string;
  title: TextStylingType;
  content: TextStylingType;
  block: blockStyleType
}

export const textStyling: TextStyles = {
  blockId: '',
  title: {
    fontFamily: '',
    fontSize: '24px',
    fontWeight: 400,
    color: 'rgb(0, 0, 0)',
    letterSpacing: '2px',
    lineHeight: '50px',
  },
  content: {
    fontFamily: '',
    fontSize: '17px',
    fontWeight: 400,
    color: 'rgb(0, 0, 0)',
    letterSpacing: '2px',
    lineHeight: '20px',
  },
  block: {
    transform: 'rotate(0deg)'
  }
};

export const fontSizes = [12, 14, 15, 16, 17, 18, 19, 21, 24, 28, 32, 35, 38, 42, 46, 48, 50, 54, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236, 240, 244, 248, 252, 256, 260, 264, 268, 272, 276, 280, 284, 288, 292, 296, 300, 304, 308, 312, 316, 320, 324, 328, 332, 336, 340, 344, 348, 352, 356, 360, 364, 368, 372, 376, 380, 384, 388, 392, 396, 400];

export const allFonts = async () => {
  try {
    const resp = await fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC4Y2RatcOQrN0WttkW-Ara5r_zGpNnGAQ');
    
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const data = await resp.json();
    
    return data

  } catch (error) {
    console.error('Error fetching Google Fonts:', error);
  }
}

export const loadFont = (fontFamily: any) => {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily?.replace(/ /g, '+')}&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};
