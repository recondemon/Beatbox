import { useState, useEffect } from 'react';
import { CirclePlus, Play } from 'lucide-react';
import { fetchLiked, selectLiked, addLike, unlike } from '../../redux/playlists';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtist } from '../../redux/artists';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { selectCurrentSong, addToQueue, clearQueue } from '../../redux/queue';
import { useLoaderData } from 'react-router-dom';

export default function ListDetails({ list }) {
  const dispatch = useDispatch();
  const url = window.location.href;
  const [artists, setArtists] = useState({});
  const [songDurations, setSongDurations] = useState({});
  const [visibleDropdowns, setVisibleDropdowns] = useState({});
  const userPlaylists = useLoaderData();
  const filteredUserPlaylists = userPlaylists.filter(
    playlist =>
      playlist.name !== 'Liked' && playlist.name !== 'Queue' && playlist.name !== 'Library',
  );
  const artist = list?.artist
    ? list?.artist[0].band_name
      ? `${list?.artist[0].band_name}`
      : `${list?.artist[0].first_name} ${list?.artist[0].last_name}`
    : null;
  const owner = list?.owner
    ? list?.owner[0].band_name
      ? `${list?.owner[0].band_name}`
      : `${list?.owner[0].first_name} ${list?.owner[0].last_name}`
    : null;
  const releaseYear = new Date(list?.releaseDate).getFullYear() || null;
  const songCount = list?.songs?.length;
  const liked = useSelector(selectLiked);
  const likedIds = liked?.map(song => song.id) || [];
  const currentSong = useSelector(selectCurrentSong);
  const coverArt = list?.albumCover || '/playlist.jpeg';

  useEffect(() => {
    if (url.includes('playlist') && list?.songs) {
      const fetchArtists = async () => {
        const artistPromises = list?.songs?.map(async song =>
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
    }
  }, [dispatch, list?.songs, url]);

  useEffect(() => {
    dispatch(fetchLiked());
  }, [dispatch]);

  // Updates duration and stores it for each song, including current song
  const handleLoadedMetadata = (songId, audioElement) => {
    // FIXME: Optional chaining cuz I was getting a random null error...should probably fix that...
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
    try {
      if (list.songs?.length > 0) {
        dispatch(clearQueue()).then(() => {
          list?.songs?.forEach(song => {
            dispatch(addToQueue(song));
          });
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const playSong = song => {
    dispatch(clearQueue()).then(() => dispatch(addToQueue(song)));
  };

  const handleOpenDropdown = songId => {
    setVisibleDropdowns(prev => ({
      ...prev,
      [songId]: !prev[songId],
    }));
  };

  const handleLike = song => {
    dispatch(addLike(list.id, song));
  };

  const handleUnlike = songId => {
    console.log('Unliking song...');
    dispatch(unlike(songId));
  };

  if (!list) {
    return <h2 className='self-center text-center mt-12 text-2xl font-bold'>Loading...</h2>;
  }

  return (
    <div className='mt-14 mx-44 overflow-x-clip max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent'>
      <div className='mb-6 w-[80vw]'>
        <span className='flex gap-2 items-center'>
          <img
            className='max-w-56 max-h-56 rounded-md border border-accent'
            src={list?.name === 'Liked' ? '/liked.jpeg' : coverArt}
            alt='album artwork'
          />

          <div className='flex flex-col justify-center space-y-1'>
            <p className='font-semibold'>{url.includes('playlist') ? 'Playlist' : 'Album'}</p>

            <h1 className='text-3xl font-bold'>{list?.name}</h1>

            <p className='text-sm'>
              {`${artist || owner} • `}
              {releaseYear && <>{` ${releaseYear} • `}</>} {songCount}
              {`${songCount === 1 ? ' song' : ' songs'}`}
            </p>

            <p className='text-sm py-2 text-wrap w-fit'>{list?.description}</p>

            <div className='flex gap-4'>
              <button
                className='p-3 bg-green-500 w-fit rounded-full'
                onClick={handlePlayAllSongs}
              >
                <Play />
              </button>
            </div>
          </div>
        </span>
      </div>

      <ul className='bg-card text-card-foreground w-full border border-border h-2/3 rounded-md'>
        {list?.songs?.length ? (
          list?.songs?.map(song => (
            <li className='flex flex-col hover:bg-muted h-full rounded-sm'>
              <div className='flex mx-4 items-center py-4'>
                <div className='flex gap-4 items-center mr-2'>
                  {likedIds.includes(song.id) ? (
                    <FaHeart
                      onClick={() => handleUnlike(song.id)}
                      className='cursor-pointer text-primary font-xl'
                      size={24}
                    />
                  ) : (
                    <FaRegHeart
                      onClick={() => handleLike(song)}
                      className='cursor-pointer text-primary font-xl'
                      size={24}
                    />
                  )}

                  <button onClick={() => handleOpenDropdown(song.id)}>
                    <CirclePlus />
                  </button>

                  {visibleDropdowns[song.id] && (
                    <div className='absolute z-10 origin-top-left mt-40 w-56 ml-8 rounded-md bg-background shadow-lg'>
                      {filteredUserPlaylists.map(playlist => (
                        <div
                          key={playlist.id}
                          className='p-2 hover:bg-muted cursor-pointer'
                        >
                          <span className='text-sm'>Add to {playlist.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                      className={`font-semibold ${
                        currentSong?.id === song.id ? 'text-green-500' : ''
                      }`}
                    >
                      {song.name}
                    </h3>
                  </div>

                  <div className='flex-1 text-center'>
                    <p
                      className={`font-semibold ${
                        currentSong?.id === song.id ? 'text-green-500' : ''
                      }`}
                    >
                      {song.artist_id in artists && artists[song.artist_id]}
                    </p>
                  </div>

                  <div className='flex-1 text-right'>
                    <p
                      className={`font-semibold ${
                        currentSong?.id === song.id ? 'text-green-500' : ''
                      }`}
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
}
