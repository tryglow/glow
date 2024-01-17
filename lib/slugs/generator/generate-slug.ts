'use server';

import {nouns} from './nouns';
import {adjectives} from './adjectives';

export async function generateSlug(options = {}) {
  const defaults = {
    number: false,
    words: 2,
    alliterative: false,
  };
  options = {...defaults, ...options};

  const raw = getRawProjName(options);

  return raw.join('-');
}

function getRawProjName(options) {
  const raw = [];
  for (let i = 0; i < options.words - 1; i++) {
    if (options.alliterative && raw.length) {
      raw.push(
        sample(getAlliterativeMatches(adjectives, raw[0].substring(0, 1)))
      );
    } else {
      raw.push(sample(adjectives).toLowerCase());
    }
  }

  if (options.alliterative) {
    raw.push(sample(getAlliterativeMatches(nouns, raw[0].substring(0, 1))));
  } else {
    raw.push(sample(nouns).toLowerCase());
  }

  if (options.number) {
    raw.push(Math.floor(Math.random() * 9998) + 1);
  }
  return raw;
}

function getAlliterativeMatches(arr, letter) {
  const check = letter.toLowerCase();
  return arr.filter((elm) => elm.substring(0, 1).toLowerCase() === check);
}

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}
