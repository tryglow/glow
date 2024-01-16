import {JSXElementConstructor, ReactElement, ReactNode} from 'react';
import {EditForm as ContentEditForm} from './content/form';
import {Blocks} from './types';

export const editForms: Record<Blocks, JSXElementConstructor<any>> = {
  content: ContentEditForm,
  header: null,
  stack: null,
  'github-commits-this-month': null,
};
