import { type FC, type ComponentProps } from 'react';
import { Input } from './input';

type Props = ComponentProps<typeof Input> & {
  decimalPlaces?: number;
};

export const NumberInput: FC<Props> = ({ onChange, ...props }) => {
  return (
    <Input
      type='text'
      inputMode='numeric'
      pattern='[0-9]+([.][0-9]{1,2})?'
      {...props}
      onChange={e => {
        const value = e.target.value;
        const isNumber = !isNaN(Number(value));
        if (isNumber) {
          onChange?.(e);
        }
      }}
    />
  );
};
