import { Outlet } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className='min-h-screen'>
      <Outlet />
    </div>
  );
};

export default App;
