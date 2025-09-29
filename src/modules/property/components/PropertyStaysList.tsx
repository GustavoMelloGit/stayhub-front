import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { FC } from 'react';
import { usePropertyStays } from '../service/PropertyService.hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Stay, WithTenant } from '@/modules/stay/types/Stay';
import { Currency } from '@/lib/currency';

type Props = {
  propertyId: string;
};

export const PropertyStaysList: FC<Props> = ({ propertyId }) => {
  const { stays, isLoading, error } = usePropertyStays(propertyId, {
    onlyIncomingStays: true,
  });

  const handleCopy = (stay: WithTenant<Stay>) => {
    const data = [
      stay.tenant.name,
      stay.tenant.phone,
      stay.check_in.toLocaleDateString(),
      stay.check_out.toLocaleDateString(),
      `${stay.guests} hóspedes`,
    ];
    navigator.clipboard.writeText(data.join('\n'));
    toast.success('Copiado com sucesso');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de estadias</CardTitle>
        <CardDescription>
          Essa lista contém somente as estadias que ainda não foram finalizadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hóspede</TableHead>
              <TableHead>Hóspedes</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className='text-center'>
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={4} className='text-center'>
                  Erro ao carregar estadias
                </TableCell>
              </TableRow>
            )}
            {stays &&
              stays.map((stay) => {
                return (
                  <TableRow key={stay.id}>
                    <TableCell>{stay.tenant.name}</TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {stay.guests}
                    </TableCell>
                    <TableCell>
                      {stay.check_in.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {stay.check_out.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {stay.entrance_code}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {Currency.format(stay.price)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => handleCopy(stay)}
                        aria-label='Copiar informações da estadia'
                      >
                        <CopyIcon className='size-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
