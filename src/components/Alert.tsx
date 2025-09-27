import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { TriangleAlert } from 'lucide-react';
import type { FC } from 'react';

const DEFAULT_VARIANT = 'destructive';
const alertVariants = cva('rounded-md p-4 flex items-center gap-2', {
  variants: {
    variant: {
      destructive: 'bg-red-50 text-red-700 text-sm',
    },
    defaultVariants: {
      variant: DEFAULT_VARIANT,
    },
  },
});

type AlertVariants = VariantProps<typeof alertVariants>;

const iconByVariant: Record<
  NonNullable<AlertVariants['variant']>,
  React.ReactNode
> = {
  destructive: <TriangleAlert className='size-4' />,
};

type Props = React.ComponentProps<'div'> &
  AlertVariants & {
    message: string;
  };

export const Alert: FC<Props> = ({
  className,
  variant = DEFAULT_VARIANT,
  message,
  ...props
}) => {
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      {iconByVariant[variant ?? DEFAULT_VARIANT]}
      <span>{message}</span>
    </div>
  );
};
