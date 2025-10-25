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
  decimalPlaces = 2,
  ...props
}) => {
  const [innerValue, setInnerValue] = useState<string | undefined>(
    props.value?.toString()
  );

  return (
    <Input
      type='text'
      inputMode='numeric'
      {...props}
      onChange={e => {
        let value = e.target.value;

        value = value.replace(/,/g, '.');

        value = value.replace(/[^0-9.]/g, '');

        value = value.replace(/(\..*)\./g, '$1');

        const decimalPart = value.split('.')[1];
        if (decimalPart && decimalPart.length > decimalPlaces) {
          value = value.slice(0, value.length - 1);
        }

        if (decimalPlaces === 0) {
          value = value.replace(/\./g, '');
        }

        setInnerValue(value);
        const isValidNumber = !isNaN(Number(value));
        if (isValidNumber) {
          onValueChange?.(parseFloat(value));
        }
      }}
      value={innerValue}
    />
  );
};
