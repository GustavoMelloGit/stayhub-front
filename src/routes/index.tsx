import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import DashboardView from '../modules/dashboard/view/DashboardView';
import LoginView from '../modules/auth/view/LoginView';
import SignupView from '../modules/auth/view/SignupView';
import { StayInstructionsView } from '@/modules/stay/view/StayInstructionsView';

/**
 * Configuração das rotas da aplicação StayHub
 * Define todas as rotas disponíveis e seus componentes correspondentes
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DashboardView />,
      },
      {
        path: ':stay_id',
        element: <StayInstructionsView />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginView />,
  },
  {
    path: '/signup',
    element: <SignupView />,
  },
]);
