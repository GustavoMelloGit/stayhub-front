import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../service/PropertyService.hooks';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { ArrowLeft, Calendar, Edit, Trash2, Home } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { PropertyStaysList } from '../components/PropertyStaysList';

const PropertyDetailView: FC = () => {
  const { property_id } = useParams<{ property_id: string }>();
  const { property, isLoading, error } = useProperty(property_id || '');

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto'>
        <Alert variant='destructive' message='Erro ao carregar propriedade'>
          Não foi possível carregar os detalhes da propriedade. Tente novamente
          mais tarde.
        </Alert>
        <div className='mt-4'>
          <Button variant='outline' asChild>
            <Link to='/'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Voltar para início
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Alert variant='destructive' message='Propriedade não encontrada'>
          A propriedade solicitada não foi encontrada ou você não tem permissão
          para visualizá-la.
        </Alert>
        <div className='mt-4'>
          <Button variant='outline' asChild>
            <Link to='/'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Voltar para início
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto space-y-6'>
      <div>
        <Button variant='outline' className='mb-4' asChild>
          <Link to={ROUTES.home}>
            <ArrowLeft className='size-4 mr-0.5' />
            Voltar
          </Link>
        </Button>
      </div>

      <div className='bg-white rounded-lg shadow-md border border-gray-200'>
        <div className='p-6'>
          <div className='flex justify-between items-start mb-6'>
            <div className='flex items-center space-x-3'>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <Home className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900'>
                  {property.name}
                </h1>
                <p className='text-gray-600 mt-1'>Detalhes da propriedade</p>
              </div>
            </div>
            <div className='flex space-x-2'>
              <Button variant='outline'>
                <Edit className='w-4 h-4 mr-2' />
                Editar
              </Button>
              <Button
                variant='outline'
                className='text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                <Trash2 className='w-4 h-4 mr-2' />
                Excluir
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Informações Básicas
                </h3>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>ID da Propriedade</span>
                    <span className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>
                      {property.id}
                    </span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>Nome</span>
                    <span className='font-medium'>{property.name}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>ID do Usuário</span>
                    <span className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>
                      {property.user_id}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Datas Importantes
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-center space-x-3 py-2 border-b border-gray-100'>
                    <Calendar className='w-4 h-4 text-gray-400' />
                    <div className='flex-1'>
                      <span className='text-gray-600'>Criado em</span>
                      <p className='font-medium'>
                        {new Date(property.created_at).toLocaleDateString(
                          'pt-BR',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3 py-2 border-b border-gray-100'>
                    <Calendar className='w-4 h-4 text-gray-400' />
                    <div className='flex-1'>
                      <span className='text-gray-600'>Última atualização</span>
                      <p className='font-medium'>
                        {new Date(property.updated_at).toLocaleDateString(
                          'pt-BR',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  {property.deleted_at && (
                    <div className='flex items-center space-x-3 py-2 border-b border-gray-100'>
                      <Calendar className='w-4 h-4 text-red-400' />
                      <div className='flex-1'>
                        <span className='text-red-600'>Excluído em</span>
                        <p className='font-medium text-red-600'>
                          {new Date(property.deleted_at).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Ações Rápidas
                </h3>
                <div className='space-y-3'>
                  <Button className='w-full justify-start' variant='outline'>
                    <Edit className='w-4 h-4 mr-2' />
                    Editar Propriedade
                  </Button>
                  <Button className='w-full justify-start' variant='outline'>
                    <Home className='w-4 h-4 mr-2' />
                    Gerenciar Estadias
                  </Button>
                  <Button className='w-full justify-start' variant='outline'>
                    <Calendar className='w-4 h-4 mr-2' />
                    Ver Histórico
                  </Button>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Estatísticas
                </h3>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='grid grid-cols-2 gap-4 text-center'>
                    <div>
                      <p className='text-2xl font-bold text-blue-600'>0</p>
                      <p className='text-sm text-gray-600'>Estadias</p>
                    </div>
                    <div>
                      <p className='text-2xl font-bold text-green-600'>0</p>
                      <p className='text-sm text-gray-600'>Hóspedes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {property_id && <PropertyStaysList propertyId={property_id} />}
    </div>
  );
};

export default PropertyDetailView;
