import React from 'react';

/**
 * Componente de loading para exibir durante verificações de autenticação
 */
export const AuthLoadingSpinner: React.FC = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
        <p className='text-gray-600'>Verificando autenticação...</p>
      </div>
    </div>
  );
};
