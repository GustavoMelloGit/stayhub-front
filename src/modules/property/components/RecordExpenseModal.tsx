import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Alert } from '@/components/Alert';
import { useRecordExpense } from '@/modules/finance/service/FinanceService.hooks';
import { queryClient } from '@/lib/query-client';
import { Currency } from '@/lib/currency';
import { Minus } from 'lucide-react';
import z from 'zod';

const formSchema = z.object({
  amount: z.number().positive('O valor deve ser maior que zero'),
  description: z.string().optional(),
  category: z.string().min(1, 'É necessário informar a categoria'),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: Partial<FormData> = {
  amount: 0,
  description: '',
  category: '',
};

type Props = {
  propertyId: string;
  isOpen: boolean;
  onClose: () => void;
};

export const RecordExpenseModal: FC<Props> = ({
  propertyId,
  isOpen,
  onClose,
}) => {
  const { mutate, isLoading, error } = useRecordExpense({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['finance-movements', propertyId],
      });
      onClose();
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const resetForm = (): void => {
    form.reset(defaultValues);
  };

  const handleSubmit = (data: FormData): void => {
    mutate({
      property_id: propertyId,
      amount: Currency.toCents(data.amount),
      description: data.description || null,
      category: data.category.toUpperCase(),
    });
    resetForm();
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Minus className='h-5 w-5' />
            Cadastrar Despesa
          </SheetTitle>
          <SheetDescription>
            Registre uma nova despesa para esta propriedade.
          </SheetDescription>
        </SheetHeader>

        <div className='px-4'>
          {error && (
            <Alert
              variant='destructive'
              title='Erro'
              message={error.message}
              className='mb-4'
            />
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='amount'
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <NumberInput
                        decimalPlaces={2}
                        inputMode='decimal'
                        placeholder='0,00'
                        onValueChange={onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ex: Manutenção, Limpeza, Impostos...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Adicione uma descrição para esta despesa'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex gap-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleClose}
                  className='flex-1'
                >
                  Cancelar
                </Button>
                <Button type='submit' isLoading={isLoading} className='flex-1'>
                  Cadastrar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
