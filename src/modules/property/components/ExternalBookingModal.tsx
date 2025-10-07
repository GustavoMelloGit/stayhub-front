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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert } from '@/components/Alert';
import {
  externalBookingRequestSchema,
  type ExternalBookingRequest,
} from '../types/Property';
import { useCreateExternalBooking } from '../service/PropertyService.hooks';
import { queryClient } from '@/lib/query-client';
import { Link } from 'lucide-react';

type Props = {
  propertyId: string;
  isOpen: boolean;
  onClose: () => void;
};

const ExternalBookingModal: FC<Props> = ({ propertyId, isOpen, onClose }) => {
  const {
    mutate,
    isLoading: isSubmitting,
    error,
  } = useCreateExternalBooking({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconcileExternalStays'] });
      onClose();
    },
  });

  const form = useForm<ExternalBookingRequest>({
    resolver: zodResolver(externalBookingRequestSchema),
    defaultValues: {
      platform_name: undefined,
      sync_url: '',
    },
  });

  const handleSubmit = (data: ExternalBookingRequest): void => {
    mutate({
      propertyId,
      data,
    });
  };

  const handleClose = (): void => {
    form.reset();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Link className='h-5 w-5' />
            Cadastrar Link de Plataforma
          </SheetTitle>
          <SheetDescription>
            Adicione um link de sincronização para que a API possa reconciliar
            reservas das plataformas de aluguel.
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
                name='platform_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plataforma</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione a plataforma' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='AIRBNB'>Airbnb</SelectItem>
                        <SelectItem value='BOOKING'>Booking.com</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='sync_url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Sincronização</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://www.exemplo.com/ical'
                        type='url'
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
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='flex-1'
                >
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExternalBookingModal;
