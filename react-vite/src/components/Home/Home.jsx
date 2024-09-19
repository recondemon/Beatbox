import { useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';

const Home = () => {
  const user = useSelector(state => state.session.user);
  const data = useLoaderData()
  console.log(data)

  if (!user) {
    return (
      <div className='h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden'>
          <h1 className='text-2xl'>Unlock Your Music Adventure</h1>
      </div>
    );
  }

  return (
    <div className='h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden'>
      <h1 className='text-2xl'>Songs Go Here</h1>
    </div>
  )
};

export default Home;
