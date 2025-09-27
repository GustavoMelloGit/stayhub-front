import React from 'react';
import { Link } from 'react-router-dom';
import {
  useAuthData,
  useLogout,
} from '../modules/auth/service/AuthService.hooks';

/**
 * Componente de navegação principal
 * Exibe diferentes opções baseadas no estado de autenticação
 */
export const Navigation: React.FC = () => {
  const { user, isAuthenticated } = useAuthData();
  const { logout } = useLogout();

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex justify-between items-center'>
          <Link to='/' className='text-2xl font-bold text-gray-900'>
            StayHub
          </Link>

          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <>
                <span className='text-gray-700'>Olá, {user?.name}</span>
                <button
                  onClick={logout}
                  className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors'
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='text-gray-700 hover:text-gray-900 transition-colors'
                >
                  Entrar
                </Link>
                <Link
                  to='/signup'
                  className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
