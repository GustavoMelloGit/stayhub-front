import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { ExternalStay } from '@/modules/stay/types/Stay';
import z from 'zod';
import { queryClient } from '@/lib/query-client';
import { WandSparkles } from 'lucide-react';
import { useBookStay } from '../service/PropertyService.hooks';

export const reconcileStayFormSchema = z.object({
  entrance_code: z
    .string()
    .min(7, 'O código de entrada deve ter pelo menos 7 dígitos'),
  tenant_name: z.string().min(1, 'Nome do hóspede é obrigatório'),
  tenant_phone: z.string().min(13, 'Telefone do hóspede é obrigatório'),
  tenant_sex: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    message: 'Sexo do hóspede é obrigatório',
  }),
  guests: z.number().min(1, 'Número de hóspedes deve ser pelo menos 1'),
});

export type ReconcileStayFormData = z.infer<typeof reconcileStayFormSchema>;

type Props = {
  externalStay: ExternalStay;
  onSuccess: () => void;
};

const ReconcileStayForm: FC<Props> = ({ externalStay, onSuccess }) => {
  const {
    mutate,
    isLoading: isSubmitting,
    error,
  } = useBookStay({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconcileExternalStays'] });
      onSuccess();
    },
  });

  const form = useForm<ReconcileStayFormData>({
    resolver: zodResolver(reconcileStayFormSchema),
    defaultValues: {
      entrance_code: '',
      tenant_name: '',
      tenant_phone: '',
      tenant_sex: undefined,
      guests: 1,
    },
  });

  const handleSubmit = (data: ReconcileStayFormData): void => {
    mutate({
      check_in: externalStay.start.toISOString(),
      check_out: externalStay.end.toISOString(),
      entrance_code: data.entrance_code,
      tenant: {
        name: data.tenant_name,
        phone: data.tenant_phone,
        sex: data.tenant_sex,
      },
      guests: data.guests,
      property: externalStay.property.id,
    });
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>Cadastrar Estadia Externa</CardTitle>
        <div className='text-sm text-muted-foreground space-y-1'>
          <p>
            <strong>Propriedade:</strong> {externalStay.property.name}
          </p>
          <p>
            <strong>Plataforma:</strong> {externalStay.sourcePlatform}
          </p>
          <p>
            <strong>Check-in:</strong> {formatDate(externalStay.start)}
          </p>
          <p>
            <strong>Check-out:</strong> {formatDate(externalStay.end)}
          </p>
        </div>
      </CardHeader>
      <CardContent>
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
              name='entrance_code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Entrada</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <Input
                        placeholder='Digite o código de entrada'
                        {...field}
                      />
                      <Button
                        variant='outline'
                        size='icon'
                        aria-label='Gerar código de entrada aleatório'
                        onClick={() => {
                          // generate random number with 7 digits
                          field.onChange(
                            Math.floor(
                              1000000 + Math.random() * 9999999
                            ).toString()
                          );
                        }}
                      >
                        <WandSparkles />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tenant_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Hóspede</FormLabel>
                  <FormControl>
                    <Input placeholder='Digite o nome do hóspede' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tenant_phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone do Hóspede</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Digite o telefone do hóspede'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tenant_sex'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo do Hóspede</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Selecione o sexo' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='MALE'>Masculino</SelectItem>
                      <SelectItem value='FEMALE'>Feminino</SelectItem>
                      <SelectItem value='OTHER'>Outro</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input
                      type='number'
                      max={7}
                      min={1}
                      placeholder='Digite o número de hóspedes'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Estadia'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReconcileStayForm;
