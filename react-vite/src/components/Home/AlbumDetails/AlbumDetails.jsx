import { useLoaderData } from 'react-router-dom';

const AlbumDetails = () => {
  const album = useLoaderData();
  const { songs } = album;
  console.log(songs);

  return (
    <div className=' mt-14 bg-secondary rounded-lg border border-border w-full h-full'>
      {album && (
        <>
          <h2 className='text-2xl my-4 font-bold'>{album.name}</h2>
          {songs.map(song => (
            <div className='flex gap-1 mb-4'>
              <p className='text-lg'>{song.name}</p>

              <audio
                className='w-full h-12 bg-secondary text-foreground rounded-md shadow-md'
                controls
              >
                <source
                  className='bg-none text-foreground rounded-md shadow-md'
                  src={`${song.url}`}
                  type='audio/m4a'
                />
              </audio>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AlbumDetails;
