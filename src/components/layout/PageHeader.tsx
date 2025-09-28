import type { FC, ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export const PageHeader: FC<Props> = ({ title, description, actions }) => {
  return (
    <div className='flex justify-between items-center gap-2 flex-wrap mb-8'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>{title}</h1>
        <p className='text-muted-foreground mt-2'>{description}</p>
      </div>
      {actions}
    </div>
  );
};
