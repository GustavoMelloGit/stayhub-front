import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import {
  useAuthData,
  useSignin,
} from '@/modules/auth/service/AuthService.hooks';
import { Alert } from '@/components/Alert';

const loginSchema = z.object({
  email: z.email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(8, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Página de login do usuário
 * Permite que usuários existentes façam login na aplicação
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthData();
  const { signin, isSigninLoading, signinError } = useSignin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  /**
   * Manipula o envio do formulário
   */
  const onSubmit = (data: LoginFormData): void => {
    signin(data, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error) => {
        console.error('Erro no login:', error);
      },
    });
  };

  return (
    <main className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Entrar na sua conta
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Digite suas credenciais para acessar o StayHub
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-8 space-y-6'
          >
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
              <span className='text-sm text-gray-600'>
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
      </div>
    </main>
  );
};

export default LoginPage;
