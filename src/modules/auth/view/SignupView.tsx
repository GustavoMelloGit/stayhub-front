import type React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { SignupForm } from '../components/SignupForm';

/**
 * Página de cadastro de usuário
 * Permite que novos usuários se registrem na aplicação
 */
const SignupView: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = (): void => {
    const from = location.state?.from?.pathname || ROUTES.home;
    navigate(from, { replace: true });
  };

  return (
    <main className='flex min-h-dvh items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>{t('signup.title')}</CardTitle>
          <CardDescription>{t('signup.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <SignupForm
            onSuccess={handleSuccess}
            onError={error => {
              console.error(t('signup.consoleErrorPrefix'), error);
            }}
          />

          <div className='text-center'>
            <span className='text-sm text-muted-foreground'>
              {t('signup.alreadyHaveAccountText')}{' '}
              <Link
                to={ROUTES.login}
                className='font-medium text-blue-600 hover:text-blue-500'
              >
                {t('signup.loginLink')}
              </Link>
            </span>
          </div>

          <div className='text-xs text-muted-foreground'>
            {t('signup.termsText')}{' '}
            <Link to='/terms' className='text-blue-600 hover:text-blue-500'>
              {t('signup.termsLink')}
            </Link>{' '}
            {t('signup.andConnector')}{' '}
            <Link to='/privacy' className='text-blue-600 hover:text-blue-500'>
              {t('signup.privacyLink')}
            </Link>
            .
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignupView;
