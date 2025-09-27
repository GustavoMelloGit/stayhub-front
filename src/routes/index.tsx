import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage';
import StayInstructionsPage from '../pages/StayInstructionsPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';

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
        element: <HomePage />,
      },
      {
        path: ':stay_id',
        element: <StayInstructionsPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
]);
