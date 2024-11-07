export type Blocks =
  | 'header'
  | 'content'
  | 'stack'
  | 'image'
  | 'github-commits-this-month'
  | 'spotify-playing-now'
  | 'spotify-embed'
  | 'instagram-latest-post'
  | 'map'
  | 'link-box'
  | 'link-bar'
  | 'waitlist-email'
  | 'youtube'
  | 'threads-follower-count'
  | 'tiktok-follower-count'
  | 'tiktok-latest-post';

export interface EditFormProps<T> {
  initialValues: T;
  onSave: (values: T) => void;
  onClose: () => void;
  blockId: string;
}
