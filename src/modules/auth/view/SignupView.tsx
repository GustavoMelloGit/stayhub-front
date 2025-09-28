import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
import { useSignup } from '@/modules/auth/service/AuthService.hooks';
import { Alert } from '@/components/Alert';
import { ROUTES } from '@/routes/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.email('Email inválido').min(1, 'Email é obrigatório'),
    password: z.string().min(8, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Página de cadastro de usuário
 * Permite que novos usuários se registrem na aplicação
 */
const SignupView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isSignupLoading, signupError } = useSignup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  /**
   * Manipula o envio do formulário
   */
  const onSubmit = (data: SignupFormData): void => {
    // Remove confirmPassword antes de enviar
    const { confirmPassword: _confirmPassword, ...signupData } = data;

    signup(signupData, {
      onSuccess: () => {
        const from = location.state?.from?.pathname || ROUTES.home;
        navigate(from, { replace: true });
      },
      onError: (error) => {
        console.error('Erro no cadastro:', error);
      },
    });
  };

  return (
    <main className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='max-w-md w-full'>
        <CardHeader>
          <CardTitle>Criar nova conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para se cadastrar no StayHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Seu nome completo'
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='seu@email.com'
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
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Mínimo 6 caracteres'
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
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Digite a senha novamente'
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
                  variant='destructive'
                  message={
                    signupError instanceof Error
                      ? signupError.message
                      : 'Erro ao criar conta. Tente novamente.'
                  }
                />
              )}

              <div>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSignupLoading}
                >
                  {isSignupLoading ? 'Carregando...' : 'Cadastrar'}
                </Button>
              </div>

              <div className='text-center'>
                <span className='text-sm text-muted-foreground'>
                  Já tem uma conta?{' '}
                  <Link
                    to='/login'
                    className='font-medium text-blue-600 hover:text-blue-500'
                  >
                    Faça login
                  </Link>
                </span>
              </div>

              <div className='text-xs text-muted-foreground'>
                Ao se cadastrar, você concorda com nossos{' '}
                <Link to='/terms' className='text-blue-600 hover:text-blue-500'>
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link
                  to='/privacy'
                  className='text-blue-600 hover:text-blue-500'
                >
                  Política de Privacidade
                </Link>
                .
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignupView;
