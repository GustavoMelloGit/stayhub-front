import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../service/PropertyService.hooks';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { PropertyStaysList } from '../components/PropertyStaysList';
import ExternalBookingModal from '../components/ExternalBookingModal';
import { Page } from '@/components/layout/Page';
import { ROUTES } from '@/routes/routes';
import { useDisclosure } from '@/hooks/useDisclosure';

const PropertyDetailView: FC = () => {
  const { property_id } = useParams<{ property_id: string }>();
  const { property, isLoading, error } = useProperty(property_id || '');
  const { isOpen, open, close } = useDisclosure();

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
        actions={
          <div className='flex gap-2'>
            <Button variant='outline' onClick={open}>
              <LinkIcon className='w-4 h-4 mr-2' />
              Adicionar Link
            </Button>
            <Button>Editar</Button>
          </div>
        }
      />
      <Page.Content>
        {property_id && <PropertyStaysList propertyId={property_id} />}
      </Page.Content>

      {property_id && (
        <ExternalBookingModal
          propertyId={property_id}
          isOpen={isOpen}
          onClose={close}
        />
      )}
    </Page.Container>
  );
};

export default PropertyDetailView;
