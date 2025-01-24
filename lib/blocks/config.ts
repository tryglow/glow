import * as Yup from 'yup';

import {
  YouTubeBlockSchema,
  defaults as youtubeDefaults,
} from '@/lib/blocks/youtube/config';
import { ContentSchema, defaults as contentDefaults } from './content/config';
import {
  GithubCommitsThisMonthSchema,
  defaults as githubCommitsThisMonthDefaults,
} from './github-commits-this-month/config';
import { HeaderSchema, defaults as headerDefaults } from './header/config';
import { ImageSchema, defaults as imageDefaults } from './image/config';
import {
  InstagramLatestPostSchema,
  defaults as instagramLatestPostDefaults,
} from './instagram-latest-post/config';
import { LinkBarSchema, defaults as linkBarDefaults } from './link-bar/config';
import { LinkBoxSchema, defaults as linkBoxDefaults } from './link-box/config';
import { MapSchema, defaults as mapDefaults } from './map/config';
import {
  SpotifyEmbedSchema,
  defaults as spotifyEmbedDefaults,
} from './spotify-embed/config';
import { defaults as spotifyPlayingNowDefaults } from './spotify-playing-now/config';
import { StackSchema, defaults as stackDefaults } from './stack/config';
import { defaults as threadsFollowerCountDefaults } from './threads-follower-count/config';
import { defaults as AccordionBlockDefaults, AccordionSchema } from './accordion/config';
import { tiktokFollowerCountBlockDefaults } from './tiktok-follower-count/config';
import { tiktokLatestPostBlockDefaults } from './tiktok-latest-post/config';
import { reactionBlockDefaults, reactionBlockSchema } from './reaction/config';
import { Blocks } from './types';
import {
  WaitlistEmailBlockSchema,
  defaults as waitlistEmailDefaults,
} from './waitlist-email/config';
import {
  TextFormBlockSchema,
  defaults as textFormDefaults,
} from './text-form/config';
import {
  SelectionFormBlockSchema,
  defaults as selectionFormDefaults,
} from './selection-form/config';
import { instagramFollowerCountBlockDefaults } from './instagram-follower-count/config';

export const blocksConfig: Record<
  Blocks,
  {
    schema: Yup.Schema | null;
    defaults: any;
    isBeta?: boolean;
    integrationType?: string;
  }
> = {
  'link-box': {
    schema: LinkBoxSchema,
    defaults: linkBoxDefaults,
  },
  stack: {
    defaults: stackDefaults,
    schema: StackSchema,
  },
  content: {
    defaults: contentDefaults,
    schema: ContentSchema,
  },
  header: {
    defaults: headerDefaults,
    schema: HeaderSchema,
  },
  image: {
    defaults: imageDefaults,
    schema: ImageSchema,
  },
  'github-commits-this-month': {
    defaults: githubCommitsThisMonthDefaults,
    schema: GithubCommitsThisMonthSchema,
  },
  'spotify-playing-now': {
    defaults: spotifyPlayingNowDefaults,
    schema: null,
  },
  'instagram-latest-post': {
    defaults: instagramLatestPostDefaults,
    schema: InstagramLatestPostSchema,
  },
  'instagram-follower-count': {
    defaults: instagramFollowerCountBlockDefaults,
    schema: null
  },
  map: {
    defaults: mapDefaults,
    schema: MapSchema,
  },
  'link-bar': {
    defaults: linkBarDefaults,
    schema: LinkBarSchema,
  },
  'spotify-embed': {
    defaults: spotifyEmbedDefaults,
    schema: SpotifyEmbedSchema,
  },
  'waitlist-email': {
    defaults: waitlistEmailDefaults,
    schema: WaitlistEmailBlockSchema,
  },
  'text-form': {
    defaults: textFormDefaults,
    schema: TextFormBlockSchema,
  },
  'selection-form': {
    defaults: selectionFormDefaults,
    schema: SelectionFormBlockSchema,
  },
  youtube: {
    defaults: youtubeDefaults,
    schema: YouTubeBlockSchema,
  },
  'threads-follower-count': {
    defaults: threadsFollowerCountDefaults,
    schema: null,
    isBeta: true,
  },
  'accordion': {
    defaults: AccordionBlockDefaults,
    schema: AccordionSchema,
    // isBeta: true,
  },
  'tiktok-follower-count': {
    defaults: tiktokFollowerCountBlockDefaults,
    schema: null,
  },
  'tiktok-latest-post': {
    defaults: tiktokLatestPostBlockDefaults,
    schema: null,
  },
  reactions: {
    defaults: reactionBlockDefaults,
    schema: reactionBlockSchema,
  },
};
