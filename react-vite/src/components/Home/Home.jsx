import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAlbums, selectAlbumsArray } from '../../redux/albums';
import { fetchPlaylists, selectPlaylistsArray } from '../../redux/playlists';
import { useEffect, useState } from 'react';
import { fetchSongs, selectSongsArray } from '../../redux/songs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const albums = useSelector(selectAlbumsArray);
  const playlists = useSelector(selectPlaylistsArray);
  const songs = useSelector(selectSongsArray);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAlbums());
    dispatch(fetchPlaylists());
    dispatch(fetchSongs());
  }, [dispatch]);

  const handleScroll = (direction, section) => {
    const container = document.getElementById(section);
    const scrollAmount = direction === 'left' ? -300 : 300;
    container.scrollBy({
      top: 0,
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const filterContent = (items) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (!user) {
    return (
      <div className='h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden'>
        <h1 className='text-3xl'>Unlock Your Music Adventure</h1>
      </div>
    );
  }

  return (
    <div className='flex flex-col my-8 w-full px-10 justify-center items-center'>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for songs, albums, playlists..."
          className="w-full p-3 rounded-lg bg-input text-foreground border border-muted"
        />
      </div>

      {/* Content Section */}
      {albums.length || playlists.length || songs.length ? (
        <>
          <h2 className='mb-6 text-2xl font-bold'>Explore</h2>

          {/* Songs */}
          <div className='relative mb-8'>
            <h3 className="text-xl mb-4">Songs</h3>
            <div className="flex items-center gap-4">
              <ChevronLeft className='cursor-pointer' onClick={() => handleScroll('left', 'songs-section')} />
              <div
                id="songs-section"
                className="flex overflow-x-auto whitespace-nowrap gap-4"
              >
                {filterContent(songs).map(song => (
                  <Link key={song.id} to={`/song/${song.id}`}>
                    <div className='bg-card p-6 w-56 h-52 inline-block text-center rounded-lg shadow text-foreground justify-center border-muted border-2 transition-transform transform hover:scale-105 hover:shadow-md hover:cursor-pointer'>
                      <p>Image</p>
                      <p className='text-lg font-semibold'>{song.name}</p>
                      <p className='text-sm'>
                        by {song.artist[0].first_name} {song.artist[0].last_name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <ChevronRight className='cursor-pointer' onClick={() => handleScroll('right', 'songs-section')} />
            </div>
          </div>

          {/* Albums */}
          <div className='relative mb-8'>
            <h3 className="text-xl mb-4">Albums</h3>
            <div className="flex items-center gap-4">
              <ChevronLeft className='cursor-pointer' onClick={() => handleScroll('left', 'albums-section')} />
              <div
                id="albums-section"
                className="flex overflow-x-auto whitespace-nowrap gap-4"
              >
                {filterContent(albums).map(album => (
                  <Link key={album.id} to={`/album/${album.id}`}>
                    <div className='bg-card p-6 w-56 h-52 inline-block text-center rounded-lg shadow text-foreground justify-center border-muted border-2 transition-transform transform hover:scale-105 hover:shadow-md hover:cursor-pointer'>
                      <p>Image</p>
                      <p className='text-lg font-semibold'>{album.name}</p>
                      <p className='text-sm'>
                        by {album.artist[0].first_name} {album.artist[0].last_name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <ChevronRight className='cursor-pointer' onClick={() => handleScroll('right', 'albums-section')} />
            </div>
          </div>

          {/* Playlists */}
          <div className='relative mb-8'>
            <h3 className="text-xl mb-4">Playlists</h3>
            <div className="flex items-center gap-4">
              <ChevronLeft className='cursor-pointer' onClick={() => handleScroll('left', 'playlists-section')} />
              <div
                id="playlists-section"
                className="flex overflow-x-auto whitespace-nowrap gap-4"
              >
                {filterContent(playlists).map(playlist => (
                  <Link key={playlist.id} to={`/playlist/${playlist.id}`}>
                    <div className='bg-card p-6 w-56 h-52 inline-block text-center rounded-lg shadow text-foreground justify-center border-muted border-2 transition-transform transform hover:scale-105 hover:shadow-md hover:cursor-pointer'>
                      <p>{playlist.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <ChevronRight className='cursor-pointer' onClick={() => handleScroll('right', 'playlists-section')} />
            </div>
          </div>
        </>
      ) : (
        <p className='text-2xl'>Loading...</p>
      )}
    </div>
  );
};

export default Home;
