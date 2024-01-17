import {JSXElementConstructor} from 'react';
import {EditForm as ContentEditForm} from './content/form';
import {EditForm as GithubCommitsThisMonthForm} from './github-commits-this-month/form';
import {EditForm as HeaderForm} from './header/form';
import {EditForm as SpotifyPlayingNowForm} from './spotify-playing-now/form';

import {Blocks} from './types';

export const editForms: Record<Blocks, JSXElementConstructor<any>> = {
  content: ContentEditForm,
  header: HeaderForm,
  stack: HeaderForm,
  'github-commits-this-month': GithubCommitsThisMonthForm,
  'spotify-playing-now': SpotifyPlayingNowForm,
};
