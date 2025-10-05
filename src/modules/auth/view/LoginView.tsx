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
import { useSignin } from '@/modules/auth/service/AuthService.hooks';
import { Alert } from '@/components/Alert';
import { ROUTES } from '@/routes/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const loginSchema = z.object({
  email: z.email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(8, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Página de login do usuário
 * Permite que usuários existentes façam login na aplicação
 */
const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signin, isSigninLoading, signinError } = useSignin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Manipula o envio do formulário
   */
  const onSubmit = (data: LoginFormData): void => {
    signin(data, {
      onSuccess: () => {
        const from = location.state?.from?.pathname || ROUTES.home;
        navigate(from, { replace: true });
      },
      onError: error => {
        console.error('Erro no login:', error);
      },
    });
  };

  return (
    <main className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='max-w-sm w-full'>
        <CardHeader>
          <CardTitle>Entrar na sua conta</CardTitle>
          <CardDescription>
            Digite suas credenciais para acessar o StayHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='space-y-4'>
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
                          placeholder='Sua senha'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {signinError && (
                <Alert
                  variant='destructive'
                  message={
                    signinError instanceof Error
                      ? signinError.message
                      : 'Erro ao fazer login. Verifique suas credenciais.'
                  }
                />
              )}

              <div>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSigninLoading}
                >
                  {isSigninLoading ? 'Carregando...' : 'Entrar'}
                </Button>
              </div>

              <div className='text-center'>
                <span className='text-sm text-muted-foreground'>
                  Não tem uma conta?{' '}
                  <Link
                    to='/signup'
                    className='font-medium text-blue-600 hover:text-blue-500'
                  >
                    Cadastre-se
                  </Link>
                </span>
              </div>

              <div className='text-right'>
                <Link
                  to='/forgot-password'
                  className='text-sm text-blue-600 hover:text-blue-500'
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginView;
