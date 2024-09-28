import './home.css';
import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAlbums, selectAlbumsArray } from '../../redux/albums';
import { fetchPlaylists, selectPlaylistsArray } from '../../redux/playlists';
import { useEffect, useState } from 'react';
import { fetchSongs, selectSongsArray, selectPagination } from '../../redux/songs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clearQueue, addToQueue } from '../../redux/queue';
import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent, setOnModalClose } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 10;
  const { totalPages } = useSelector(selectPagination);
  const user = useSelector(state => state.session.user);
  const albums = useSelector(selectAlbumsArray);
  const playlists = useSelector(selectPlaylistsArray);
  const songs = useSelector(selectSongsArray);
  const owner = user?.bandName || `${user?.firstName} ${user?.lastName}`;

  useEffect(() => {
    dispatch(fetchAlbums());
    dispatch(fetchPlaylists());
    dispatch(fetchSongs(currentPage, songsPerPage));
  }, [dispatch, currentPage, songsPerPage]);

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const handleScroll = (direction, section) => {
    const container = document.getElementById(section);
    const scrollAmount = direction === 'left' ? -300 : 300;
    container.scrollBy({
      top: 0,
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const filterContent = items => {
    return items.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const handleSongClick = (song, index) => {
    if (index !== undefined && index !== null && songs?.length > 0) {
      dispatch(clearQueue()).then(() => dispatch(addToQueue(song)));
      navigate(`/album/${song.albumId}`);
    } else {
      console.error('Invalid song index or songs array is empty:', index, songs);
    }
  };

  const onClick = modal => {
    setModalContent(modal);
  };

  if (!user) {
    return (
      <div className='h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden'>
        <h1 className='reflection relative text-3xl text-foreground'>
          Unlock Your Music Adventure
        </h1>

        <div className='flex gap-4 mt-14'>
          <button
            onClick={() => onClick(<SignupFormModal />)}
            className='bg-primary text-foreground text-sm md:text-lg px-4 py-1 transition duration-300 rounded-md hover:bg-muted'
          >
            Sign Up
          </button>

          <button
            onClick={() => onClick(<LoginFormModal />)}
            className='bg-primary text-foreground text-sm md:text-lg px-4 py-1 transition duration-300 rounded-md hover:bg-muted'
          >
            Log In
          </button>
        </div>

        <img
          className='absolute z-[-1] h-1/2 w-full blur-md object-cover opacity-70 rounded-sm'
          src='/banner.jpeg'
          alt='record cover image'
        />

        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 z-[-1]'></div>
      </div>
    );
  }

  // const shuffledSongs = shuffleArray(filterContent(songs));

  return (
    <div className='flex flex-col my-8 w-full justify-center items-center'>
      {/* Search Bar */}
      <div className='mb-6 w-full max-w-3xl mx-auto'>
        <input
          type='text'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder='Search for songs, albums, playlists...'
          className='w-full p-3 rounded-lg bg-input text-foreground border border-border'
        />
      </div>

      {/* Content Section */}
      {albums?.length || playlists?.length || songs?.length ? (
        <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent max-h-[calc(100vh-250px)]'>
          <h2 className='mb-6 text-2xl font-bold'>Explore</h2>

          {/* Songs */}
          <div className='relative mb-8 w-full py-6 overflow-y-hidden'>
            <h3 className='text-xl mb-4 text-center'>Songs</h3>

            <div className='flex items-center gap-4 justify-center min-w-[80vw] max-w-[80vw] mx-auto'>
              <ChevronLeft
                className='cursor-pointer'
                onClick={() => handleScroll('left', 'songs-section')}
              />
              <div
                id='songs-section'
                className='flex overflow-x-auto overflow-y-hidden whitespace-nowrap gap-4 min-w-[70vw] max-w-[70vw] mx-auto scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent'
              >
                {songs?.map((song, index) => (
                  <div key={song.id}>
                    <div className='h-fit rounded-lg w-56 h-52 inline-block whitespace-pre-wrap text-center text-foreground justify-center'>
                      <img
                        src={song.album?.[0]?.album_cover}
                        alt='album cover'
                        className='cursor-pointer transition border-2 border-muted duration-200 hover:border-accent w-full h-full object-cover rounded-md'
                        onClick={() => handleSongClick(song, index)}
                      />

                      <p className='text-lg font-semibold'>{song.name}</p>

                      <p className='text-sm'>
                        {song.artist[0].band_name ||
                          `${song.artist[0].first_name} ${song.artist[0].last_name}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <ChevronRight
                className='cursor-pointer'
                onClick={() => handleScroll('right', 'songs-section')}
              />
            </div>

            {/* Pagination */}
            <div className='flex justify-center mt-4'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-primary text-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          {/* Albums */}
          <div className='relative mb-8 w-full'>
            <h3 className='text-xl mb-4 text-center'>Albums</h3>
            <div className='flex items-center gap-4 justify-center min-w-[80vw] max-w-[80vw] mx-auto'>
              <ChevronLeft
                className='cursor-pointer'
                onClick={() => handleScroll('left', 'albums-section')}
              />
              <div
                id='albums-section'
                className='flex overflow-x-auto overflow-y-hidden whitespace-nowrap gap-4 mx-auto min-w-[70vw] max-w-[70vw] scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent'
              >
                {filterContent(albums).map(album => (
                  <Link
                    key={album.id}
                    to={`/album/${album.id}`}
                  >
                    <div className='h-fit rounded-lg w-56 inline-block text-center shadow text-foreground justify-center'>
                      <img
                        src={album.albumCover}
                        alt='album cover'
                        className='cursor-pointer transition border-2 border-muted duration-200 hover:border-accent w-full h-full object-cover rounded-md'
                      />

                      <p className='text-lg font-semibold whitespace-pre-wrap'>{album.name}</p>

                      <p className='text-sm'>
                        {album.artist?.[0]?.band_name
                          ? album.artist[0].band_name
                          : `${album.artist?.[0]?.first_name} ${album.artist?.[0]?.last_name}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <ChevronRight
                className='cursor-pointer'
                onClick={() => handleScroll('right', 'albums-section')}
              />
            </div>
          </div>

          {/* Playlists */}
          <div className='relative mb-8 w-full'>
            <h3 className='text-xl mb-4 text-center'>Playlists</h3>

            <div className='flex items-center gap-4 justify-center min-w-[80vw] max-w-[80vw] mx-auto'>
              <ChevronLeft
                className='cursor-pointer'
                onClick={() => handleScroll('left', 'playlists-section')}
              />
              <div
                id='playlists-section'
                className='flex overflow-x-auto overflow-y-hidden whitespace-nowrap gap-4 mx-auto min-w-[70vw] max-w-[70vw] scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent'
              >
                {filterContent(playlists).map(playlist =>
                  playlist.owner[0].band_name !== owner &&
                  `${playlist.owner[0].first_name} ${playlist.owner[0].last_name}` !== owner ? (
                    <Link
                      key={playlist.id}
                      to={`/playlist/${playlist.id}`}
                    >
                      <div className='h-fit rounded-lg w-56 inline-block text-center shadow text-foreground justify-center'>
                        <img
                          className='cursor-pointer transition border-2 border-muted duration-200 hover:border-accent w-full h-full object-cover rounded-md'
                          src='/playlist.jpeg'
                          alt='playlist image'
                        />
                        <p className='text-lg font-semibold whitespace-pre-wrap'>{playlist.name}</p>
                      </div>
                    </Link>
                  ) : null,
                )}
              </div>
              <ChevronRight
                className='cursor-pointer'
                onClick={() => handleScroll('right', 'playlists-section')}
              />
            </div>
          </div>
        </div>
      ) : (
        <h2 className='text-2xl'>Loading...</h2>
      )}
    </div>
  );
};

export default Home;
