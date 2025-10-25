import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { withMask } from 'use-mask-input';
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
import { ENTRANCE_CODE_LENGTH } from '@/config/constants';
import { Page } from '@/components/layout/Page';
import { ROUTES } from '@/routes/routes';
import { CHECK_IN_HOUR, CHECK_OUT_HOUR } from '../types/Property';
import { Currency } from '@/lib/currency';
import { Phone } from '@/lib/phone';

export const reconcileStayFormSchema = z.object({
  entrance_code: z
    .string()
    .min(
      ENTRANCE_CODE_LENGTH,
      `O código de entrada deve ter pelo menos ${ENTRANCE_CODE_LENGTH} dígitos`
    ),
  tenant_name: z.string().min(1, 'Nome do hóspede é obrigatório'),
  tenant_phone: z.string().refine(value => Phone.isValid(value), {
    message: 'Telefone do hóspede é inválido',
  }),
  tenant_sex: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    message: 'Sexo do hóspede é obrigatório',
  }),
  guests: z.string().refine(
    value => {
      const isNumber = !isNaN(Number(value));
      const isPositive = Number(value) >= 1;
      const isInteger = Number.isInteger(Number(value));
      return isNumber && isPositive && isInteger;
    },
    {
      message: 'Número de hóspedes deve ser pelo menos 1',
    }
  ),
  price: z.string().refine(
    value => {
      const isNumber = !isNaN(Number(value));
      const isPositive = Number(value) >= 0;
      return isNumber && isPositive;
    },
    {
      message: 'Preço da estadia é inválido',
    }
  ),
});

export type ReconcileStayFormData = z.infer<typeof reconcileStayFormSchema>;

type Props = {
  externalStay: ExternalStay;
  goBack: () => void;
};

const ReconcileStayForm: FC<Props> = ({ externalStay, goBack }) => {
  const {
    mutate,
    isLoading: isSubmitting,
    error,
  } = useBookStay({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconcileExternalStays'] });
      queryClient.invalidateQueries({ queryKey: ['propertyStays'] });
      goBack();
    },
  });

  const form = useForm<ReconcileStayFormData>({
    resolver: zodResolver(reconcileStayFormSchema),
    defaultValues: {
      entrance_code: '',
      tenant_name: '',
      tenant_phone: '',
      tenant_sex: undefined,
      guests: '1',
      price: '0',
    },
  });

  const handleSubmit = (data: ReconcileStayFormData): void => {
    const phone = data.tenant_phone.replace(/\D/g, '');
    const checkIn = new Date(externalStay.start);
    checkIn.setHours(CHECK_IN_HOUR, 0, 0, 0);
    const checkOut = new Date(externalStay.end);
    checkOut.setHours(CHECK_OUT_HOUR, 0, 0, 0);

    const payload = {
      check_in: checkIn.toISOString(),
      check_out: checkOut.toISOString(),
      entrance_code: data.entrance_code,
      tenant: {
        name: data.tenant_name,
        phone: phone,
        sex: data.tenant_sex,
      },
      guests: Number(data.guests),
      property: externalStay.property.id,
      price: Currency.toCents(Number(data.price)),
    };

    mutate(payload);
  };

  const generateRandomEntranceCode = (): string => {
    const size = ENTRANCE_CODE_LENGTH;
    if (size < 1) {
      throw new Error('O tamanho deve ser 1 ou maior.');
    }

    const min = Math.pow(10, size - 1);

    const max = Math.pow(10, size) - 1;

    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          {
            label: 'Reconciliar Estadias Externas',
            to: ROUTES.reconcileStays,
            onClick: () => goBack(),
          },
          { label: 'Cadastrar Estadia Externa' },
        ]}
      />
      <Page.Header
        title='Cadastrar Estadia Externa'
        description={`Cadastre a estadia externa da propriedade ${externalStay.property.name}.`}
      />
      <Page.Content>
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
                            maxLength={ENTRANCE_CODE_LENGTH}
                            minLength={ENTRANCE_CODE_LENGTH}
                            {...field}
                          />
                          <Button
                            variant='outline'
                            size='icon'
                            aria-label='Gerar código de entrada aleatório'
                            onClick={() => {
                              // generate random number with ENTRANCE_CODE_LENGTH digits
                              field.onChange(generateRandomEntranceCode());
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
                        <Input
                          placeholder='Digite o nome do hóspede'
                          {...field}
                        />
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
                      <FormControl ref={withMask(Phone.MASK)}>
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
                          min={1}
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
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Preço da Estadia</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          step={0.01}
                          pattern='[0-9]+([.][0-9]{1,2})?'
                          placeholder='Digite o preço da estadia'
                          inputMode='decimal'
                          {...field}
                          onChange={e => {
                            console.log(e.target.value);
                            onChange(e.target.value);
                          }}
                          value={value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  className='w-full'
                  isLoading={isSubmitting}
                >
                  Cadastrar Estadia
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Page.Content>
    </Page.Container>
  );
};

export default ReconcileStayForm;
