import { StackSchema, defaults as stackDefaults } from './stack/config';
import { HeaderSchema, defaults as headerDefaults } from './header/config';
import { ContentSchema, defaults as contentDefaults } from './content/config';
import { ImageSchema, defaults as imageDefaults } from './image/config';
import {
  GithubCommitsThisMonthSchema,
  defaults as githubCommitsThisMonthDefaults,
} from './github-commits-this-month/config';
import { defaults as spotifyPlayingNowDefaults } from './spotify-playing-now/config';
import { defaults as twitterLatestTweetDefaults } from './twitter-latest-tweet/config';
import { defaults as instagramLatestPostDefaults } from './instagram-latest-post/config';
import { defaults as mapDefaults } from './map/config';
import { defaults as linkBoxDefaults } from './link-box/config';
import { LinkBoxSchema } from './link-box/config';
import { Blocks } from './types';
import * as Yup from 'yup';

export const blocksConfig: Record<
  Blocks,
  {
    schema: Yup.Schema | null;
    defaults: any;
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
  'twitter-latest-tweet': {
    defaults: twitterLatestTweetDefaults,
    schema: null,
  },
  'instagram-latest-post': {
    defaults: instagramLatestPostDefaults,
    schema: null,
  },
  map: {
    defaults: mapDefaults,
    schema: null,
  },
};
