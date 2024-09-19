import { useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';

const Home = () => {
  const user = useSelector(state => state.session.user);
  const data = useLoaderData();

  if (!user) {
    return (
      <div className='h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden'>
        <h1 className='text-2xl'>Unlock Your Music Adventure</h1>
      </div>
    );
  }

  return (
    <div
      className='flex flex-col w-sm my-20 mx-60'
    >
      {data.Songs ? (
        data.Songs.forEach(song => (
            <p className='text-xl'>{song.title}</p>
        ))
      ) : (
          <p className='text-xl'>No Songs Yet</p>
      )}
    </div>
  );
};

export default Home;
