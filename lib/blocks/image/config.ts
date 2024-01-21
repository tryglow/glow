import * as Yup from 'yup';

export interface ImageBlockConfig {
  src: string;
}

export const defaults: ImageBlockConfig = {
  src: '/demo/image.jpg',
};

export const ImageSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  description: Yup.string().required('Please provide a subtitle'),
  avatar: Yup.string().required('Please provide an avatar URL'),
});
