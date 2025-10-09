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
import { Alert } from '@/components/Alert';
import {
  updatePropertyRequestSchema,
  type UpdatePropertyRequest,
} from '../types/Property';
import { useUpdateProperty } from '../service/PropertyService.hooks';
import { queryClient } from '@/lib/query-client';
import { Edit } from 'lucide-react';

type Props = {
  propertyId: string;
  propertyName: string;
  isOpen: boolean;
  onClose: () => void;
};

const EditPropertyModal: FC<Props> = ({
  propertyId,
  propertyName,
  isOpen,
  onClose,
}) => {
  const {
    mutate,
    isLoading: isSubmitting,
    error,
  } = useUpdateProperty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      onClose();
    },
  });

  const form = useForm<UpdatePropertyRequest>({
    resolver: zodResolver(updatePropertyRequestSchema),
    defaultValues: {
      name: propertyName,
    },
  });

  const handleSubmit = (data: UpdatePropertyRequest): void => {
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
            <Edit className='h-5 w-5' />
            Editar Propriedade
          </SheetTitle>
          <SheetDescription>
            Atualize as informações da propriedade.
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
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Propriedade</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Digite o nome da propriedade'
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
                  className='flex-1'
                  isLoading={isSubmitting}
                >
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditPropertyModal;
