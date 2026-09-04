import { useMemo, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert } from '@/components/Alert';
import { useTranslation } from '@/i18n/useTranslation';
import { useSignup } from '../service/AuthService.hooks';

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type InlineSignupFormProps = {
  onSuccess: () => void;
};

/**
 * Formulário de cadastro embutido, par do `InlineSigninForm`.
 *
 * Existe pelo mesmo motivo: uma página que perderia estado da URL ao navegar
 * para `/signup` (como `?request_id=`) precisa oferecer o cadastro sem sair da
 * rota. Reaproveita as strings de `signup.*` em vez de duplicá-las — os campos
 * são os mesmos da tela cheia, e traduções repetidas divergem com o tempo.
 */
export const InlineSignupForm: FC<InlineSignupFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation('auth');
  const { signup, isSignupLoading, signupError } = useSignup();

  const signupSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2, t('validation.nameMin')),
          email: z
            .email(t('validation.emailInvalid'))
            .min(1, t('validation.emailRequired')),
          password: z.string().min(8, t('validation.passwordMin')),
          confirmPassword: z
            .string()
            .min(1, t('validation.confirmPasswordRequired')),
        })
        .refine(data => data.password === data.confirmPassword, {
          message: t('validation.passwordMismatch'),
          path: ['confirmPassword'],
        }),
    [t]
  );

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const handleSubmit = ({
    confirmPassword: _confirmPassword,
    ...credentials
  }: SignupFormData): void => {
    signup(credentials, { onSuccess });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-4'
        noValidate
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('signup.nameLabel')}</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  autoComplete='name'
                  placeholder={t('signup.namePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('signup.emailLabel')}</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  autoComplete='email'
                  placeholder={t('signup.emailPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('signup.passwordLabel')}</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  autoComplete='new-password'
                  placeholder={t('signup.passwordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('signup.confirmPasswordLabel')}</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  autoComplete='new-password'
                  placeholder={t('signup.confirmPasswordPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {signupError && (
          <Alert
            role='alert'
            variant='destructive'
            message={
              signupError instanceof Error
                ? signupError.message
                : t('signup.genericError')
            }
          />
        )}

        <Button
          type='submit'
          size='lg'
          className='w-full'
          isLoading={isSignupLoading}
        >
          {t('signup.submitButton')}
        </Button>
      </form>
    </Form>
  );
};
