import * as Yup from 'yup';

export interface ReactionBlockConfig {
  reactions: number
  showLove: boolean;
  text?: string
}

export const reactionBlockDefaults: ReactionBlockConfig = {
  reactions: 0,
  showLove: true,
  text: 'Love'
};

export const reactionBlockSchema = Yup.object().shape({
  reactions: Yup.number(),
  showLove: Yup.boolean(),
  text: Yup.string().required('Please provide text')
});