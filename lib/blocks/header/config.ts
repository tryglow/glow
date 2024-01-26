import * as Yup from 'yup';

export interface HeaderBlockConfig {
  title: string;
  description: string;
  avatar: {
    src: string;
  };
}

export const defaults: HeaderBlockConfig = {
  avatar: {
    src: 'https://cdn.oneda.sh/default-data/avatar.svg',
  },
  title: 'Hello World',
  description: 'Welcome to your new page',
};

export const HeaderSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  description: Yup.string().required('Please provide a subtitle'),
  avatar: Yup.object().shape({
    src: Yup.string(),
  }),
});
