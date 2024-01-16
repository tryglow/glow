import {Content} from '@/lib/blocks/content/ui';
import {Header} from '@/lib/blocks/header/ui';
import {Stack} from '@/lib/blocks/stack/ui';
import {GitHubCommitsThisMonth} from './github-commits-this-month/ui';

export interface BlockConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
}

export function renderBlock(block: any, pageId: string) {
  switch (block.type) {
    case 'header':
      return <Header {...block.data} pageId={pageId} />;
    case 'content':
      return <Content {...block.data} pageId={pageId} />;
    case 'stack':
      return <Stack {...block.data} pageId={pageId} />;
    case 'github-commits-this-month':
      return <GitHubCommitsThisMonth {...block.data} pageId={pageId} />;
  }
}
