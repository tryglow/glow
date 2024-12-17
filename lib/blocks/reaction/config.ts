import * as Yup from 'yup';

export interface ReactionBlockConfig {
  reactions: number
  showLove: boolean;
}

export const reactionBlockDefaults: ReactionBlockConfig = {
  reactions: 0,
  showLove: true,
};

export const reactionBlockSchema = Yup.object().shape({
  reactions: Yup.number(),
  showLove: Yup.boolean(),
});