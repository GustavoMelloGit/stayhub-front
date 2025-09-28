import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useUserProperties } from '../service/PropertyService.hooks';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { ROUTES } from '@/routes/routes';
import { PageHeader } from '@/components/layout/PageHeader';

const PropertyListView: FC = () => {
  const { properties, isLoading, error } = useUserProperties();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Alert variant='destructive' message='Erro ao carregar propriedades'>
          Não foi possível carregar suas propriedades. Tente novamente mais
          tarde.
        </Alert>
      </div>
    );
  }

  return (
    <div className='container mx-auto'>
      <PageHeader
        title='Minhas Propriedades'
        description='Gerencie suas propriedades e visualize informações importantes'
        actions={<Button>Adicionar Propriedade</Button>}
      />

      {properties.length === 0 ? (
        <div className='text-center py-12'>
          <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
            <svg
              className='w-12 h-12 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Nenhuma propriedade encontrada
          </h3>
          <p className='text-gray-500 mb-6'>
            Comece adicionando sua primeira propriedade para gerenciar suas
            estadias.
          </p>
          <Button className='bg-blue-600 hover:bg-blue-700'>
            Adicionar Primeira Propriedade
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {properties.map((property) => (
            <div
              key={property.id}
              className='bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200'
            >
              <div className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {property.name}
                  </h3>
                  <div className='flex space-x-2'>
                    <Button variant='outline' size='sm'>
                      Editar
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 hover:text-red-700'
                    >
                      Excluir
                    </Button>
                  </div>
                </div>

                <div className='space-y-2 text-sm text-gray-600'>
                  <div className='flex justify-between'>
                    <span>ID:</span>
                    <span className='font-mono text-xs'>{property.id}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Criado em:</span>
                    <span>
                      {new Date(property.created_at).toLocaleDateString(
                        'pt-BR'
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Atualizado em:</span>
                    <span>
                      {new Date(property.updated_at).toLocaleDateString(
                        'pt-BR'
                      )}
                    </span>
                  </div>
                </div>

                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <div className='flex space-x-2'>
                    <Link to={ROUTES.property(property.id)} className='flex-1'>
                      <Button variant='outline' size='sm' className='w-full'>
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Button variant='outline' size='sm' className='flex-1'>
                      Gerenciar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyListView;
