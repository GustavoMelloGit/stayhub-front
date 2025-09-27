import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import DashboardView from '../modules/dashboard/view/DashboardView';
import LoginView from '../modules/auth/view/LoginView';
import SignupView from '../modules/auth/view/SignupView';
import { StayInstructionsView } from '@/modules/stay/view/StayInstructionsView';
import { NotFoundView } from '@/modules/error/view/NotFoundView';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { ROUTES } from './routes';

/**
 * Configuração das rotas da aplicação StayHub
 * Define todas as rotas disponíveis e seus componentes correspondentes
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.dashboard,
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardView />,
      },
    ],
  },
  {
    path: ROUTES.stayInstructions(':stay_id'),
    element: <StayInstructionsView />,
  },
  {
    path: ROUTES.login,
    element: (
      <PublicRoute>
        <LoginView />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.signup,
    element: (
      <PublicRoute>
        <SignupView />
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundView />,
  },
]);
