import * as Yup from 'yup';

import { ContentSchema, defaults as contentDefaults } from './content/config';
import {
  GithubCommitsThisMonthSchema,
  defaults as githubCommitsThisMonthDefaults,
} from './github-commits-this-month/config';
import { HeaderSchema, defaults as headerDefaults } from './header/config';
import { ImageSchema, defaults as imageDefaults } from './image/config';
import { defaults as instagramLatestPostDefaults } from './instagram-latest-post/config';
import { LinkBarSchema, defaults as linkBarDefaults } from './link-bar/config';
import { defaults as linkBoxDefaults } from './link-box/config';
import { LinkBoxSchema } from './link-box/config';
import { MapSchema, defaults as mapDefaults } from './map/config';
import { defaults as spotifyPlayingNowDefaults } from './spotify-playing-now/config';
import { StackSchema, defaults as stackDefaults } from './stack/config';
import { Blocks } from './types';

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
  'instagram-latest-post': {
    defaults: instagramLatestPostDefaults,
    schema: null,
  },
  map: {
    defaults: mapDefaults,
    schema: MapSchema,
  },
  'link-bar': {
    defaults: linkBarDefaults,
    schema: LinkBarSchema,
  },
};
