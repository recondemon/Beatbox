import { useSelector } from 'react-redux';

const Home = () => {
  const user = useSelector(state => state.session.user);

  if (!user) {
    return (
      <div className='h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden'>
        <div className='text-center'>
          <h1 className='text-2xl'>Unlock Your Music Adventure</h1>
        </div>
      </div>
    );
  }

  return <div className='bg-background h-[calc(100vh-64px)]'>Home</div>;
};

export default Home;
