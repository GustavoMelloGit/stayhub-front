import type { FC } from 'react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { useReconcileExternalStays } from '../service/PropertyService.hooks';
import ReconcileStayForm from '../components/ReconcileStayForm';
import type { ExternalStay } from '@/modules/stay/types/Stay';
import { PageHeader } from '@/components/layout/PageHeader';

const ReconcileStaysView: FC = () => {
  const [selectedStay, setSelectedStay] = useState<ExternalStay | null>(null);

  const {
    stays: externalStays,
    isLoading: isLoadingStays,
    error: staysError,
  } = useReconcileExternalStays();

  const handleSuccess = (): void => {
    setSelectedStay(null);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  if (selectedStay) {
    return (
      <div className='container mx-auto p-6'>
        <div className='mb-6'>
          <Button
            variant='outline'
            onClick={() => setSelectedStay(null)}
            className='mb-4'
          >
            ← Voltar para lista
          </Button>
          <h1 className='text-2xl font-bold'>Cadastrar Estadia Externa</h1>
        </div>
        <ReconcileStayForm
          externalStay={selectedStay}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className='container mx-auto'>
      <PageHeader
        title='Reconciliar Estadias Externas'
        description={`Encontradas ${externalStays?.length} estadias externas que ainda não foram cadastradas.`}
      />
      {staysError && (
        <Alert
          variant='destructive'
          title='Erro'
          message={staysError.message}
        />
      )}
      {isLoadingStays && <p className='text-center'>Carregando...</p>}
      {(!externalStays || externalStays.length === 0) && !isLoadingStays && (
        <p className='text-muted-foreground text-center'>
          Não há estadias externas pendentes para reconciliar.
        </p>
      )}
      {externalStays && externalStays.length > 0 && (
        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4'>
          {externalStays.map((stay) => (
            <Card key={`${stay.property.id}-${stay.start.toISOString()}`}>
              <CardHeader>
                <CardTitle className='flex justify-between items-start'>
                  <span>{stay.property.name}</span>
                  <span className='text-sm font-normal text-muted-foreground capitalize'>
                    {stay.sourcePlatform}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='[&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div]:gap-1'>
                  <div>
                    <p className='text-muted-foreground'>Check-in</p>
                    <p className='font-medium'>{formatDate(stay.start)}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Check-out</p>
                    <p className='font-medium'>{formatDate(stay.end)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setSelectedStay(stay)}
                  className='w-full'
                >
                  Cadastrar Estadia
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReconcileStaysView;
