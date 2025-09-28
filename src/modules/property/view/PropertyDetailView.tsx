import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../service/PropertyService.hooks';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { ArrowLeft } from 'lucide-react';
import { PropertyStaysList } from '../components/PropertyStaysList';
import { Page } from '@/components/layout/Page';
import { ROUTES } from '@/routes/routes';

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
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: 'Minhas Propriedades', to: ROUTES.home },
          { label: property.name },
        ]}
      />
      <Page.Header
        title={property.name}
        description='Detalhes da propriedade'
        actions={<Button>Editar</Button>}
      />
      <Page.Content>
        <div className='container mx-auto space-y-6'>
          {property_id && <PropertyStaysList propertyId={property_id} />}
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default PropertyDetailView;
