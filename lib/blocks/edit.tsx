import { JSXElementConstructor } from 'react';

import { EditForm as ContentEditForm } from './content/form';
import { EditForm as GithubCommitsThisMonthForm } from './github-commits-this-month/form';
import { EditForm as HeaderForm } from './header/form';
import { EditForm as ImageForm } from './image/form';
import { EditForm as InstagramLatestPostForm } from './instagram-latest-post/form';
import { EditForm as LinkBarForm } from './link-bar/form';
import { EditForm as LinkBoxForm } from './link-box/form';
import { EditForm as MapForm } from './map/form';
import { EditForm as SpotifyEmbedForm } from './spotify-embed/form';
import { EditForm as SpotifyPlayingNowForm } from './spotify-playing-now/form';
import { EditForm as StackForm } from './stack/form';
import { Blocks } from './types';

export const editForms: Record<Blocks, JSXElementConstructor<any>> = {
  'link-box': LinkBoxForm,
  stack: StackForm,
  content: ContentEditForm,
  header: HeaderForm,
  image: ImageForm,
  'github-commits-this-month': GithubCommitsThisMonthForm,
  'spotify-playing-now': SpotifyPlayingNowForm,
  'instagram-latest-post': InstagramLatestPostForm,
  map: MapForm,
  'link-bar': LinkBarForm,
  'spotify-embed': SpotifyEmbedForm,
};
