import {defaults as stackDefaults} from './stack/defaults';
import {defaults as headerDefaults} from './header/defaults';
import {defaults as contentDefaults} from './content/defaults';
import {defaults as githubCommitsThisMonthDefaults} from './github-commits-this-month/defaults';
import {defaults as spotifyPlayingNowDefaults} from './spotify-playing-now/defaults';
import {Blocks} from './types';

export const defaults: Record<Blocks, object> = {
  stack: stackDefaults,
  content: contentDefaults,
  header: headerDefaults,
  'github-commits-this-month': githubCommitsThisMonthDefaults,
  'spotify-playing-now': spotifyPlayingNowDefaults,
};
