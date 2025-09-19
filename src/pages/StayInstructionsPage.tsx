import { useGetPublicStay } from '@/modules/stay/service/StayService.hooks';
import { StayInstructionsView } from '@/modules/stay/view/StayInstructionsView';
import { useParams } from 'react-router-dom';

const StayInstructionsPage: React.FC = () => {
  const { stay_id } = useParams<{ stay_id: string }>();
  const { data: stay, isPending } = useGetPublicStay(stay_id || '');

  return (
    <main className='grid place-items-center'>
      {isPending && <div>Carregando...</div>}
      {stay && (
        <StayInstructionsView
          stay={{
            checkIn: stay.check_in,
            checkOut: stay.check_out,
            entranceCode: stay.entrance_code,
            tenant: stay.tenant,
          }}
        />
      )}
    </main>
  );
};

export default StayInstructionsPage;
