import { type FC } from 'react';
import { useUserProperties } from '../service/PropertyService.hooks';
import { Button, buttonVariants } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { Page } from '@/components/layout/Page';
import { Plus } from 'lucide-react';

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
    <Page.Container>
      <Page.Topbar nav={[{ label: 'Minhas Propriedades' }]} />
      <Page.Header
        title='Minhas Propriedades'
        description='Gerencie suas propriedades e visualize informações importantes'
        actions={
          <Button>
            <Plus className='w-4 h-4' />
            Nova Propriedade
          </Button>
        }
      />
      <Page.Content>
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
          <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2'>
            {properties.map(property => {
              return (
                <Card className='pt-0 gap-0' key={property.id}>
                  <CardHeader className='p-0 rounded-[inherit]'>
                    <img
                      src='https://picsum.photos/200'
                      alt=''
                      className='rounded-[inherit] rounded-b-none w-full aspect-video object-cover'
                    />
                  </CardHeader>
                  <CardContent className='pt-2 px-4 space-y-4'>
                    <CardTitle>{property.name}</CardTitle>
                    <Link
                      to={ROUTES.property(property.id)}
                      className={buttonVariants({
                        variant: 'default',
                        className: 'w-full',
                      })}
                    >
                      Ver detalhes
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </Page.Content>
    </Page.Container>
  );
};

export default PropertyListView;
