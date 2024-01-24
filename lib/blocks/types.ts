export type Blocks =
  | 'header'
  | 'content'
  | 'stack'
  | 'image'
  | 'github-commits-this-month'
  | 'spotify-playing-now'
  | 'instagram-latest-post'
  | 'map'
  | 'link-box';

export interface EditFormProps<T> {
  initialValues: T;
  onSave: (values: T) => void;
  onClose: () => void;
  blockId: string;
}
