import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAlbums, selectAlbumsArray } from '../../redux/albums';
import { useEffect } from 'react';
import { fetchPlaylists, selectPlaylistsArray } from '../../redux/playlists';

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const albums = useSelector(selectAlbumsArray);
  const playlists = useSelector(selectPlaylistsArray)
  console.log(albums)
  console.log(playlists)

  useEffect(() => {
    dispatch(fetchAlbums());
    dispatch(fetchPlaylists())
  }, [dispatch]);

  if (!user) {
    return (
      <div className='h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden'>
        <h1 className='text-3xl'>Unlock Your Music Adventure</h1>
      </div>
    );
  }

  return (
    <div className='my-8 max-w-fit mx-60'>
      {/* TODO: Possibly extract to separate components with their own "Loading..." conditional */}
      {albums.length || playlists.length ? (
        <>
          <h2 className='mb-6 text-2xl font-bold'>Explore</h2>

          {/* Albums */}
          <div className='flex flex-wrap gap-6'>
            {albums?.map(album => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
              >
                <div className='bg-card p-6 w-56 h-52 text-center rounded-lg shadow flex flex-col items-center text-foreground justify-center border-muted border-2 transition-transform transform hover:scale-105 hover:shadow-md hover:cursor-pointer'>
                  <p className='justify-self-start align-self-start'>image goes here</p>
                  <p className='text-lg font-semibold'>{album.name}</p>
                  <p className='text-sm'>
                    by {album.artist[0].first_name} {album.artist[0].last_name}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Playlist*/}
          <div className='flex gap-6 mt-4 max-w-1/2 min-h-40'>
            {playlists?.map(playlist => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
              >
                <div
                  key={playlist.id}
                  className='bg-card p-6 w-56 h-52 text-center rounded-lg shadow flex flex-col items-center text-foreground justify-center border-muted border-2 transition-transform transform hover:scale-105 hover:shadow-md hover:cursor-pointer'
                >
                  <p className='text-lg font-semibold'>{playlist.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className='text-2xl'>Loading...</p>
      )}
    </div>
  );
};

export default Home;
