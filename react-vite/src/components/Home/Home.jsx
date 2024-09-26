import { useDispatch, useSelector } from 'react-redux';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { fetchAlbums, selectAlbumsArray } from '../../redux/albums';
import {
  fetchPlaylists,
  selectPlaylistsArray,
  fetchLiked,
  selectLiked,
  // addLike,
} from '../../redux/playlists';
import { useEffect, useState } from 'react';
import { fetchSongs, selectSongsArray } from '../../redux/songs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clearQueue, addToQueue } from '../../redux/queue';
// import { FaRegHeart, FaHeart } from 'react-icons/fa';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector(state => state.session.user);
  const albums = useSelector(selectAlbumsArray);
  const playlists = useSelector(selectPlaylistsArray);
  const songs = useSelector(selectSongsArray);
  // const likedPlaylist = useLoaderData();
  const likedSongs = useSelector(selectLiked);
  // const likeIds = likedSongs?.map(song => song.id) || [];

  useEffect(() => {
    dispatch(fetchAlbums());
    dispatch(fetchPlaylists());
    dispatch(fetchSongs());
    dispatch(fetchLiked());
  }, [dispatch]);

  // const handleLike = song => {
  //   dispatch(addLike(likedPlaylist.id, song));
  // };

  // const shuffleArray = array => {
  //   const shuffled = [...array];
  //   for (let i = shuffled.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  //   }
  //   return shuffled;
  // };

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
    if (index !== undefined && index !== null && songs.length > 0) {
      dispatch(clearQueue()).then(() => dispatch(addToQueue(song)));
      navigate(`/album/${song.albumId}`);
    } else {
      console.error('Invalid song index or songs array is empty:', index, songs);
    }
  };

  if (!user) {
    return (
      <div className='h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden'>
        <h1 className='text-3xl'>Unlock Your Music Adventure</h1>
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
      {albums.length || playlists.length || songs.length ? (
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
                {songs.map((song, index) => (
                  <div key={song.id}>
                    <div className='h-fit rounded-lg w-56 h-52 inline-block whitespace-pre-wrap text-center text-foreground justify-center'>
                      <img
                        src={song.album?.[0]?.album_cover}
                        alt='album cover'
                        className='cursor-pointer transition border-2 border-muted duration-200 hover:border-accent w-full h-full object-cover rounded-md'
                        onClick={() => handleSongClick(song, index)}
                      />

                      <p className='text-lg font-semibold'>{song.name}</p>

                      {/*                         {song.id in likeIds ? ( */}
                      {/*                           <FaHeart className='cursor-pointer text-primary font-xl' /> */}
                      {/*                         ) : ( */}
                      {/*                           <FaRegHeart */}
                      {/*                             onClick={() => handleLike(song)} */}
                      {/*                             className='cursor-pointer text-primary font-xl' */}
                      {/*                           /> */}
                      {/*                         )} */}

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
                        className='border-muted border-2 transition duration-300 hover:border-accent cursor-pointer w-full h-full object-cover rounded-md'
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
                {filterContent(playlists).map(playlist => (
                  <Link
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                  >
                    <div className='h-fit rounded-lg w-56 inline-block text-center shadow text-foreground justify-center'>
                      <img
                        className='border-muted border-2 transition duration-300 hover:border-accent cursor-pointer w-full h-full object-cover rounded-md'
                        src='/playlist.jpeg'
                        alt='playlist image'
                      />

                      <p className='text-lg font-semibold whitespace-pre-wrap'>{playlist.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <ChevronRight
                className='cursor-pointer'
                onClick={() => handleScroll('right', 'playlists-section')}
              />
            </div>
          </div>
        </div>
      ) : (
        <p className='text-2xl'>Loading...</p>
      )}
    </div>
  );
};

export default Home;
