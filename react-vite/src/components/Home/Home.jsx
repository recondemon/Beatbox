import { useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';

const Home = () => {
  const user = useSelector(state => state.session.user);
  const songs = useLoaderData();
  console.log(songs);

  if (!user) {
    return (
      <div className='h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden'>
        <h1 className='text-2xl'>Unlock Your Music Adventure</h1>
      </div>
    );
  }

  return (
    <div className='my-20 mx-40'>
      {songs.length ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6'>
          {songs.map(song => (
            <div
              key={song.id}
              className='bg-card p-6 max-w-72 rounded-lg shadow flex flex-col items-center text-card-foreground border transition-transform transform hover:scale-105 hover:shadow-md hover:cursor-pointer'
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
  );
};

export default Home;
