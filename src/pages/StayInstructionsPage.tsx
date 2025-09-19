import { StayInstructionsView } from '@/modules/stay/view/StayInstructionsView';
import { useParams } from 'react-router-dom';

const StayInstructionsPage: React.FC = () => {
  const { stay_id } = useParams<{ stay_id: string }>();

  const stay = {
    tenant: {
      name: 'John Doe',
    },
    entranceCode: '123456',
    checkIn: '2021-01-01',
    checkOut: '2021-01-02',
  };

  return (
    <main className='grid place-items-center'>
      <StayInstructionsView stay={stay} />
    </main>
  );
};

export default StayInstructionsPage;
