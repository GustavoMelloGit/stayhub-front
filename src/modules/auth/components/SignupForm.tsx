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

type SignupFormProps = {
  onSuccess: () => void;
  onError?: (error: unknown) => void;
};

/**
 * Campos e validação do cadastro, sem a moldura da página.
 *
 * Serve tanto a `SignupView`, que navega depois do sucesso, quanto à tela de
 * consentimento OAuth, que não pode navegar para lugar nenhum sob risco de
 * perder o `?request_id=`. O que muda entre as duas é só o `onSuccess` e o que
 * as cerca — termos de uso, link para o login —, então isso fica fora daqui.
 */
export const SignupForm: FC<SignupFormProps> = ({ onSuccess, onError }) => {
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
    signup(credentials, { onSuccess, onError });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-6'
        noValidate
      >
        <div className='space-y-4'>
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
        </div>

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

        <Button type='submit' className='w-full' isLoading={isSignupLoading}>
          {t('signup.submitButton')}
        </Button>
      </form>
    </Form>
  );
};
