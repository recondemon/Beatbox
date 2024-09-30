import { useEffect, useRef, useState } from 'react';
import { Trash, MoreHorizontal, Play } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToQueue, clearQueue, selectCurrentSong } from '../../../redux/queue';
import { fetchPlaylist, selectPlaylistById } from '../../../redux/playlists';
import { fetchArtist } from '../../../redux/artists';
import LikeButton from '../../ListDetails/LikeButton';
import AddToLibrary from '../../ListDetails/AddToLibrary';
import EditPlaylist from '../../ManagePlaylists/EditPlaylist';
import DropDown from '../../ListDetails/DropDown';
import DeletePlaylistModal from '../../ListDetails/DeletePlaylistModal';
import { useModal } from '../../../context/Modal';
import { useParams } from 'react-router-dom';

const PlaylistDetails = () => {
  const dispatch = useDispatch();
  const [songDurations, setSongDurations] = useState({});
  const [editingPlaylist, setEditingPlaylist] = useState(false);
  const [artists, setArtists] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector(state => state.session.user);
  const currentSong = useSelector(selectCurrentSong);
  const { playlistId } = useParams();
  const playlist = useSelector(selectPlaylistById(playlistId));
  const [showAlert, setShowAlert] = useState(false);
  const dropdownRef = useRef(null);
  const { setModalContent } = useModal();
  const coverArt = '/playlist.jpeg';

  console.log('\n\n ARTISTS \n\n', artists)

  useEffect(() => {
    dispatch(fetchPlaylist(playlistId));
  }, [dispatch, playlistId]);

  useEffect(() => {
    const fetchArtists = async () => {
      const artistPromises = playlist?.songs?.map(async song =>
        dispatch(fetchArtist(song.artist_id)),
      );

      const artistData = await Promise.all(artistPromises);
      const artists = {};

      artistData.forEach(artist => {
        const artistName = artist.bandName
          ? artist.bandName
          : `${artist.firstName} ${artist.lastName}`;
        artists[artist.id] = artistName;
      });

      setArtists(artists);
    };

    fetchArtists();
  }, [dispatch]);

  const handleLoadedMetadata = (songId, audioElement) => {
    const duration = audioElement?.duration;
    setSongDurations(prevDurations => ({
      ...prevDurations,
      [songId]: duration,
    }));
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayAllSongs = () => {
    if (playlist.songs?.length > 0) {
      dispatch(clearQueue()).then(() => {
        playlist.songs.forEach(song => {
          dispatch(addToQueue(song));
        });
      });
    }
  };

  const playSong = song => {
    dispatch(clearQueue()).then(() => dispatch(addToQueue(song)));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEditPlaylist = () => {
    if (user?.id === playlist.ownerId) {
      setEditingPlaylist(true);
      setMenuOpen(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleCloseEdit = () => {
    setEditingPlaylist(false);
  };

  if (editingPlaylist) {
    return (
      <EditPlaylist
        playlist={playlist}
        onClose={handleCloseEdit}
      />
    );
  }

  return (
    <div className='mt-14 mx-44 overflow-x-clip max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent'>
      <div className='mb-6 w-[80vw] relative'>
        <span className='flex gap-2 items-center'>
          <img
            className='max-w-56 max-h-56 rounded-md border border-accent'
            src={
              playlist?.name === 'Liked'
                ? '/liked.jpeg'
                : playlist?.name === 'Library'
                  ? '/library.jpeg'
                  : coverArt
            }
            alt='album artwork'
          />

          <div className='flex flex-col justify-center space-y-1'>
            <div className='flex justify-between items-center space-y-1 relative'>
              <p className='flex font-semibold justify-start'>Playlist</p>

              <div>
                <button
                  onClick={toggleMenu}
                  className='relative'
                >
                  <MoreHorizontal
                    className='text-primary cursor-pointer hover:bg-muted rounded-lg hover:text-foreground'
                    size={30}
                  />
                </button>

                <button
                  onClick={() => {
                    setModalContent(<DeletePlaylistModal playlistId={playlistId} />);
                  }}
                  className='relative'
                >
                  {playlist?.ownerId === user.id && (
                    <Trash
                      className='ml-2 text-destructive cursor-pointer hover:bg-muted rounded-lg hover:text-foreground'
                      size={30}
                    />
                  )}
                </button>
              </div>

              {menuOpen && (
                <div
                  ref={dropdownRef}
                  className='absolute text-foreground bg-card right-0 top-6 mt-2 rounded-lg shadow-lg z-10 p-2 w-1/2'
                >
                  <ul>
                    <li>
                      <button
                        onClick={handleEditPlaylist}
                        className='block px-4 py-2 text-sm w-full text-center hover:bg-muted rounded-lg'
                      >
                        Edit Playlist
                      </button>
                    </li>
                    <li>
                      <button className='block px-4 py-2 text-sm w-full text-center hover:bg-muted rounded-lg'>
                        Create New Playlist
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              {showAlert && (
                <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center'>
                  <div className='bg-card p-6 rounded-lg shadow-lg'>
                    <h3 className='text-xl font-semibold'>Permission Denied</h3>
                    <p className='mt-2'>You don't have permission to edit this playlist.</p>
                    <button
                      onClick={handleCloseAlert}
                      className='mt-4 px-4 py-2 bg-primary text-white rounded-lg'
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            <h1 className='text-3xl font-bold'>{playlist?.name}</h1>
            <p className='text-sm text-wrap w-fit'>{playlist?.description}</p>
          </div>

          <div className='absolute bottom-2 left-40 ml-2'>
            <button
              className='p-3 bg-green-500 w-fit rounded-lg'
              onClick={handlePlayAllSongs}
            >
              <Play />
            </button>
          </div>
        </span>
      </div>

      <ul className='bg-card text-card-foreground w-full border border-border h-2/3 rounded-md'>
        {playlist?.songs?.length ? (
          playlist?.songs?.map(song => (
            <li
              key={song.id}
              className='flex flex-col hover:bg-muted h-full rounded-sm'
            >
              <div className='flex mx-4 items-center py-4'>
                <div className='flex gap-4 items-center mr-2'>
                  <AddToLibrary song={song} />
                  <LikeButton song={song} />
                  <DropDown song={song} />
                </div>

                <div
                  className='flex w-full mx-2 items-center justify-evenly cursor-pointer'
                  onClick={() => playSong(song)}
                >
                  <audio
                    src={song.url}
                    onLoadedMetadata={e => handleLoadedMetadata(song.id, e.target)}
                    className='hidden'
                  />

                  <div className='flex-1'>
                    <h3
                      className={`font-semibold ${currentSong?.id === song.id ? 'text-green-500' : ''}`}
                    >
                      {song.name}
                    </h3>
                  </div>

                  <div className='flex-1 text-center'>
                    <p
                      className={`font-semibold ${currentSong?.id === song.id ? 'text-green-500' : ''}`}
                    >
                      {artists[song.artist_id]}
                    </p>
                  </div>

                  <div className='flex-1 text-right'>
                    <p
                      className={`font-semibold ${currentSong?.id === song.id ? 'text-green-500' : ''}`}
                    >
                      {songDurations[song.id] ? formatTime(songDurations[song.id]) : '--:--'}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <h2 className='text-center text-2xl my-2'>No songs yet</h2>
        )}
      </ul>
    </div>
  );
};

export default PlaylistDetails;
