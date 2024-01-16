import {FunctionComponent} from 'react';

interface Props {
  title: string;
  content: string;
}

export const Content: FunctionComponent<Props> = ({title, content}) => {
  return (
    <div className="py-4 h-full overflow-hidden">
      <h2 className="text-2xl font-medium text-system-label-primary">
        {title}
      </h2>
      <p className="text-lg text-system-label-secondary">{content}</p>
    </div>
  );
};
