import * as Yup from 'yup';

export interface YouTubeBlockConfig {
  videoId: string;
}

export const defaults: YouTubeBlockConfig = {
  videoId: '',
};

export const YouTubeBlockSchema = Yup.object().shape({
  videoId: Yup.string().required('Please provide a video ID'),
});
