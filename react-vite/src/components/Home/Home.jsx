import { useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';

const Home = () => {
  const user = useSelector(state => state.session.user);
  const songs = useLoaderData();

  if (!user) {
    return (
      <div className='h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden'>
        <h1 className='text-2xl'>Unlock Your Music Adventure</h1>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-sm my-20 mx-60'>
      {songs.length ? (
        songs.map(song => (
          <div>
            <p className='text-xl'>{song.name}</p>
            <audio controls>
              <source src={song.url} type="audio/m4a"/>
            </audio>
          </div>
        ))
      ) : (
        <p className='text-xl'>No Songs Yet</p>
      )}
    </div>
  );
};

export default Home;
