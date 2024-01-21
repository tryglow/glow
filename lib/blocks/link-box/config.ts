import * as Yup from 'yup';

export interface LinkBoxBlockConfig {
  title: string;
  label: string;
  icon: string;
  link: string;
}

export const defaults: LinkBoxBlockConfig = {
  icon: '',
  link: 'https://twitter.com/oneda_sh',
  title: 'Twitter',
  label: 'Follow us on Twitter',
};

export const LinkBoxSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  label: Yup.string(),
  link: Yup.string().required('Please provide a link'),
  icon: Yup.string(),
});
