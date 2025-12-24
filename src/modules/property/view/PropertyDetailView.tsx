import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../service/PropertyService.hooks';
import { Button, buttonVariants } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { PropertyStaysList } from '../components/PropertyStaysList';
import ExternalBookingModal from '../components/ExternalBookingModal';
import EditPropertyModal from '../components/EditPropertyModal';
import { Page } from '@/components/layout/Page';
import { ROUTES } from '@/routes/routes';
import { useDisclosure } from '@/hooks/useDisclosure';
import { PropertyDashboard } from '../components/property-dashboard/PropertyDashboard';

const PropertyDetailView: FC = () => {
  const { property_id } = useParams<{ property_id: string }>();
  const { property, isLoading, error } = useProperty(property_id || '');
  const { isOpen, open, close } = useDisclosure();
  const {
    isOpen: isEditOpen,
    open: openEdit,
    close: closeEdit,
  } = useDisclosure();

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
          <Link
            to='/'
            className={buttonVariants({
              variant: 'outline',
              className: 'w-full',
            })}
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Voltar para início
          </Link>
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
          <Link
            to='/'
            className={buttonVariants({
              variant: 'outline',
              className: 'w-full',
            })}
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Voltar para início
          </Link>
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
            <Button onClick={openEdit}>Editar</Button>
          </div>
        }
      />
      <Page.Content>
        <PropertyDashboard propertyId={property.id} />
        {property_id && <PropertyStaysList propertyId={property_id} />}
      </Page.Content>

      {property_id && (
        <ExternalBookingModal
          propertyId={property_id}
          isOpen={isOpen}
          onClose={close}
        />
      )}

      {property_id && property && (
        <EditPropertyModal
          property={property}
          isOpen={isEditOpen}
          onClose={closeEdit}
        />
      )}
    </Page.Container>
  );
};

export default PropertyDetailView;
