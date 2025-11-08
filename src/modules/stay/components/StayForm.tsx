import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const stayFormSchema = z.object({
  check_in: z.string(),
  check_out: z.string(),
  guests: z.int().positive(),
  price: z.number().positive(),
});

export type StayFormData = z.infer<typeof stayFormSchema>;

type Props = {
  defaultValues: StayFormData;
  onSubmit: (data: StayFormData) => Promise<void>;
  submitButtonText: string;
};

export const StayForm: FC<Props> = ({
  defaultValues,
  onSubmit,
  submitButtonText,
}) => {
  const form = useForm<StayFormData>({
    resolver: zodResolver(stayFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: StayFormData): Promise<void> => {
    return onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='check_in'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-In</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='check_out'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-Out</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='guests'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Hóspedes</FormLabel>
              <FormControl>
                <NumberInput
                  decimalPlaces={0}
                  inputMode='numeric'
                  placeholder='Digite o número de hóspedes'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço da Estadia</FormLabel>
              <FormControl>
                <NumberInput
                  decimalPlaces={2}
                  inputMode='decimal'
                  placeholder='Digite o preço da estadia'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='w-full'
          isLoading={form.formState.isSubmitting}
        >
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
};
