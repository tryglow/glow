import { JSXElementConstructor } from 'react';
import { EditForm as ContentEditForm } from './content/form';
import { EditForm as GithubCommitsThisMonthForm } from './github-commits-this-month/form';
import { EditForm as HeaderForm } from './header/form';
import { EditForm as ImageForm } from './image/form';
import { EditForm as SpotifyPlayingNowForm } from './spotify-playing-now/form';
import { EditForm as TwitterLatestTweetForm } from './twitter-latest-tweet/form';
import { EditForm as InstagramLatestPostForm } from './instagram-latest-post/form';
import { EditForm as MapForm } from './map/form';
import { EditForm as LinkBoxForm } from './link-box/form';

import { Blocks } from './types';

export const editForms: Record<Blocks, JSXElementConstructor<any>> = {
  content: ContentEditForm,
  header: HeaderForm,
  stack: HeaderForm,
  image: ImageForm,
  'github-commits-this-month': GithubCommitsThisMonthForm,
  'spotify-playing-now': SpotifyPlayingNowForm,
  'twitter-latest-tweet': TwitterLatestTweetForm,
  'instagram-latest-post': InstagramLatestPostForm,
  map: MapForm,
  'link-box': LinkBoxForm,
};
