import { Play, Pause } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

const AlbumDetails = () => {
  const [playingSong, setPlayingSong] = useState('');
  const album = useLoaderData();
  console.log(album);

  const togglePlay = songId => {
    setPlayingSong(prevId => (prevId === songId ? null : songId));
  };

  return (
    <>
      {album && (
        <div className='max-w-4xl mx-auto p-6 bg-background'>
          <h1 className='text-3xl font-bold mb-6 text-center'>{album.name}</h1>

          <ul className='space-y-4'>
            {album.songs.map(song => (
              <li
                key={song.id}
                className='flex items-center justify-between p-4 bg-card rounded-lg shadow'
              >
                <div className='flex items-center space-x-4'>
                  <button
                    onClick={() => togglePlay(song.id)}
                    className='p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
                  >
                    {playingSong === song.id ? <Pause size={24} /> : <Play size={24} />}
                  </button>

                  <div>
                    <h2 className='font-semibold'>{song.name}</h2>

                    <p className='text-sm text-muted-foreground'>{song.duration}</p>
                  </div>
                </div>

                <audio
                  src={song.url}
                  controls={playingSong === song.id}
                  className={`w-2/3 h-8 ${playingSong === song.id ? 'block' : 'hidden'}`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AlbumDetails;
