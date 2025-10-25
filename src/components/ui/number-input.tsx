import { type FC, type ComponentProps, useState } from 'react';
import { Input } from './input';

type Props = ComponentProps<typeof Input> & {
  decimalPlaces?: number;
  onValueChange?: (value: number) => void;
  value?: number;
};

export const NumberInput: FC<Props> = ({
  onChange,
  onValueChange,
  ...props
}) => {
  const [innerValue, setInnerValue] = useState<string | undefined>(
    props.value?.toString()
  );

  return (
    <Input
      type='number'
      inputMode='numeric'
      {...props}
      onChange={e => {
        const value = e.target.value;
        setInnerValue(value);
        const isValidNumber = !isNaN(Number(value));
        if (isValidNumber) {
          onValueChange?.(Number(value));
        }
      }}
      value={innerValue}
    />
  );
};
