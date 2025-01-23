export type Blocks =
  | 'header'
  | 'content'
  | 'stack'
  | 'image'
  | 'github-commits-this-month'
  | 'spotify-playing-now'
  | 'spotify-embed'
  | 'instagram-latest-post'
  | 'instagram-follower-count'
  | 'map'
  | 'link-box'
  | 'link-bar'
  | 'waitlist-email'
  | 'text-form'
  | 'selection-form'
  | 'youtube'
  | 'threads-follower-count'
  | 'accordion'
  | 'tiktok-follower-count'
  | 'tiktok-latest-post'
  | 'reactions';

export interface EditFormProps<T> {
  initialValues: T;
  onSave: (values: T) => void;
  onClose: () => void;
  blockId: string;
}
