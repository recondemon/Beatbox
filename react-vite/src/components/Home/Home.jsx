import { useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import Sidebar from './Sidebar';

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
    <>
      <div className='absolute top-20 left-4'>
        <Sidebar />
      </div>

      <div className='my-20 mx-44'>
        {songs.length ? (
          <div className='flex gap-6 max-w-1/2 min-h-40'>
            {songs.map(song => (
              <div
                key={song.id}
                className='bg-card p-6 max-w-64 rounded-lg shadow flex flex-col items-center text-foreground justify-center border-muted border-2 transition-transform transform hover:scale-105 hover:shadow-md hover:cursor-pointer'
              >
                <p className='text-xl font-semibold'>{song.name}</p>

                <p className='text-lg italic'>{song.album[0].name}</p>

                <p className='text-sm'>
                  by {song.artist[0].first_name} {song.artist[0].last_name}
                </p>

                {/* <audio */}
                {/*   className='w-full mt-4' */}
                {/*   controls */}
                {/* > */}
                {/*   <source */}
                {/*     src={song.url} */}
                {/*     type='audio/m4a' */}
                {/*   /> */}
                {/* </audio> */}
              </div>
            ))}
          </div>
        ) : (
          <p className='text-xl'>No Songs Yet</p>
        )}
      </div>
    </>
  );
};

export default Home;
