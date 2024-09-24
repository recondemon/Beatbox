import { Link, useLoaderData } from 'react-router-dom';

const Sidebar = () => {
  const { likes } = useLoaderData();
  const { albums } = useLoaderData();
  const likedSongAlbums = likes?.map(song => {
    return albums.find(album => album.id === song.song[0].album_id);
  });

  console.log('\n\n---albums---\n\n', albums);

  return (
    <div className='absolute top-20 left-4'>
      <div className='flex flex-col h-full bg-popover rounded-md'>
        <div className='flex flex-col p-4 gap-4'>
          {likedSongAlbums?.map(album => (
            <Link
              key={album?.id}
              to={`/albums/${album?.id}`}
            >
              <img
                className='w-12 h-12'
                src={album?.albumCover}
                alt='album artwork'
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
