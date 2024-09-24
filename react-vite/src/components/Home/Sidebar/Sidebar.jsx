import { useDispatch, useSelector } from 'react-redux';
import { Link, useLoaderData } from 'react-router-dom';
import { fetchAlbums, selectAlbumsArray } from '../../../redux/albums';
import { useEffect } from 'react';

const Sidebar = () => {
  const dispatch = useDispatch();
  const likedSongs = useLoaderData();
  const albums = useSelector(selectAlbumsArray);
  const likedSongAlbums = likedSongs.map(song => {
    return albums.find(album => album.id === song.song[0].album_id);
  });

  useEffect(() => {
    dispatch(fetchAlbums);
  }, [dispatch]);

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
