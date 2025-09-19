import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          StayHub - Encontre seu lugar ideal
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Exemplo de stays - substitua por dados reais */}
          <Link
            to='/stay-1'
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
          >
            <div className='h-48 bg-gray-200'></div>
            <div className='p-4'>
              <h3 className='font-semibold text-lg'>Stay Exemplo 1</h3>
              <p className='text-gray-600'>Descrição do stay...</p>
            </div>
          </Link>

          <Link
            to='/stay-2'
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
          >
            <div className='h-48 bg-gray-200'></div>
            <div className='p-4'>
              <h3 className='font-semibold text-lg'>Stay Exemplo 2</h3>
              <p className='text-gray-600'>Descrição do stay...</p>
            </div>
          </Link>

          <Link
            to='/stay-3'
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
          >
            <div className='h-48 bg-gray-200'></div>
            <div className='p-4'>
              <h3 className='font-semibold text-lg'>Stay Exemplo 3</h3>
              <p className='text-gray-600'>Descrição do stay...</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
