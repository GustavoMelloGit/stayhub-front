import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/routes/routes';
import type { FC } from 'react';

export const NotFoundView: FC = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full mx-auto text-center px-6'>
        <div className='mb-8'>
          <h1 className='text-9xl font-bold text-gray-300 mb-4'>404</h1>
          <h2 className='text-3xl font-semibold text-gray-800 mb-2'>
            Página não encontrada
          </h2>
          <p className='text-gray-600 mb-8'>
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            to={ROUTES.home}
            className={buttonVariants({
              variant: 'outline',
              className: 'w-full',
              size: 'lg',
            })}
          >
            Voltar ao Dashboard
          </Link>

          <Link
            to={ROUTES.login}
            className={buttonVariants({
              variant: 'outline',
              className: 'w-full',
              size: 'lg',
            })}
          >
            Ir para Login
          </Link>
        </div>

        <div className='mt-8 text-sm text-gray-500'>
          <p>
            Se você acredita que isso é um erro, entre em contato com o{' '}
            <a
              href='https://www.linkedin.com/in/gustavo-marques-mello/'
              className='underline text-blue-500'
            >
              suporte
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
