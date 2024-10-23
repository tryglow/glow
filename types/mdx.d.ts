export interface ArticleMetadata {
  slug?: string;
  title: string;
  publishDate: string;
  author: string;
  authorPosition: string;
  description: string;
}

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;

  export const metadata: ArticleMetadata;
}
