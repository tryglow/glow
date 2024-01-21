export interface StackBlockConfig {
  title: string;
  label: string;
  items: {
    title: string;
    label: string;
    icon: {
      src: string;
    };
  }[];
}

export const defaults: StackBlockConfig = {
  title: 'Stack',
  label: 'My apps & tools',
  items: [
    {
      title: 'Notion',
      label: 'Productivity',
      icon: {
        src: '/demo/notion.jpeg',
      },
    },
    {
      title: 'Vercel',
      label: 'Engineering',
      icon: {
        src: '/demo/vercel.jpeg',
      },
    },
    {
      title: 'Figma',
      label: 'Design',
      icon: {
        src: '/demo/figma.jpeg',
      },
    },
  ],
};
