import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage';
import StayInstructionsPage from '../pages/StayInstructionsPage';

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
]);
