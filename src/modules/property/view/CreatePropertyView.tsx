import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/button';
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
import { ROUTES } from '@/routes/routes';
import { createPropertyRequestSchema } from '../types/Property';
import { useCreateProperty } from '../service/PropertyService.hooks';
import { queryClient } from '@/lib/query-client';

const formSchema = createPropertyRequestSchema.extend({
  capacity: z.string().refine(v => Number(v) >= 1, {
    message: 'Capacidade deve ser pelo menos 1',
  }),
  images: z
    .array(z.object({ url: z.string().min(1, 'URL é obrigatória') }))
    .min(1, 'Pelo menos uma imagem é obrigatória'),
});

type FormData = z.infer<typeof formSchema>;

const CreatePropertyView: FC = () => {
  const navigate = useNavigate();

  const { mutate, isLoading, error } = useCreateProperty({
    onSuccess: property => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      navigate(ROUTES.property(property.id));
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      capacity: '1',
      images: [{ url: '' }],
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'Brasil',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  const handleSubmit = (data: FormData): void => {
    mutate({
      name: data.name,
      capacity: Number(data.capacity),
      images: data.images.map(i => i.url),
      address: data.address,
    });
  };

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: 'Minhas Propriedades', to: ROUTES.home },
          { label: 'Nova Propriedade' },
        ]}
      />
      <Page.Header
        title='Nova Propriedade'
        description='Preencha as informações para cadastrar uma nova propriedade'
      />
      <Page.Content>
        <div className='max-w-2xl'>
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
              className='space-y-6'
            >
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold'>Informações Básicas</h2>

                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Propriedade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Ex: Apartamento Centro'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='capacity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade (hóspedes)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          step={1}
                          inputMode='numeric'
                          placeholder='Ex: 4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-4'>
                <h2 className='text-lg font-semibold'>Imagens</h2>

                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`images.${index}.url`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem {index + 1}</FormLabel>
                        <div className='flex gap-2'>
                          <FormControl>
                            <Input placeholder='https://...' {...inputField} />
                          </FormControl>
                          {fields.length > 1 && (
                            <Button
                              type='button'
                              variant='outline'
                              size='icon'
                              onClick={() => remove(index)}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ url: '' })}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Adicionar Imagem
                </Button>
              </div>

              <div className='space-y-4'>
                <h2 className='text-lg font-semibold'>Endereço</h2>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='address.zip_code'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder='00000-000' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <FormControl>
                          <Input placeholder='Brasil' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='address.street'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder='Ex: Rua das Flores' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='address.number'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder='Ex: 123' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.complement'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Ex: Apto 42 (opcional)'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='address.neighborhood'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder='Ex: Centro' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='address.city'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder='Ex: São Paulo' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.state'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder='Ex: SP' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='flex gap-2 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => navigate(ROUTES.home)}
                  className='flex-1'
                >
                  Cancelar
                </Button>
                <Button type='submit' className='flex-1' isLoading={isLoading}>
                  Cadastrar Propriedade
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default CreatePropertyView;
