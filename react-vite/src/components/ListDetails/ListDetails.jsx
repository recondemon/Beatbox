import { useState, useEffect } from 'react';
import { CirclePlus, Play } from 'lucide-react';
import { fetchLiked, selectLiked, addLike, fetchPlaylists } from '../../redux/playlists';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtist } from '../../redux/artists';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { selectCurrentSong, addToQueue, clearQueue, setCurrentSongIndex } from '../../redux/queue';

export default function ListDetails({ list }) {
  const dispatch = useDispatch();
  const url = window.location.href;
  const [artists, setArtists] = useState({});
  const [songDurations, setSongDurations] = useState({});
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
    dispatch(fetchPlaylists());
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

        // const restructureSongs = list.songs.map(song => ({
        //   album: [
        //     {
        //       id: song.album_id,
        //       album_cover: list.albumCover,
        //     },
        //   ],
        //   albumId: song.album_id,
        //   artist: [
        //     {
        //       band_name: list?.artist?.[0].band_name,
        //       first_name: list?.artist?.[0].first_name,
        //       last_name: list?.artist?.[0].last_name,
        //     },
        //   ],
        //   artistId: song.artist_id,
        //   id: song.id,
        //   name: song.name,
        //   url: song.url,
        // }));

        // restructureSongs.forEach(song => {
        //   dispatch(addToQueue(song));
        // });

        // dispatch(addToQueue(restructureSongs[0]));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const playSong = song => {
    dispatch(clearQueue()).then(() => dispatch(addToQueue(song)));

    // const structuredSong = {
    //   album: [
    //     {
    //       id: song.album_id,
    //       album_cover: list.albumCover,
    //     },
    //   ],
    //   albumId: song.album_id,
    //   artist: [
    //     {
    //       band_name: list.artist[0]?.band_name || '',
    //       first_name: list.artist[0]?.first_name || '',
    //       last_name: list.artist[0]?.last_name || '',
    //     },
    //   ],
    //   artistId: song.artist_id,
    //   id: song.id,
    //   name: song.name,
    //   url: song.url,
    // };

    // dispatch(setCurrentSongIndex());
    // dispatch(addToQueue(song));
  };

  const handleAddClick = () => {
    /* TODO: clicking opens drop down with options like: add to playlist, add to queue, etc.  */
  };

  const handleLike = song => {
    dispatch(addLike(list.id, song));
  };

  if (!list) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className='container mt-14 xl:max-w-fit sm:max-w-5xl max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent'>
      <div className='mb-6 w-[80vw]'>
        <span className='flex gap-2 items-center'>
          <img
            className='max-w-64 max-h-64 rounded-md border border-accent'
            src={list?.name === 'Liked' ? '/liked.jpeg' : coverArt}
            alt='album artwork'
          />

          <div className='flex flex-col justify-center space-y-1'>
            <p className='font-semibold'>{url.includes('playlist') ? 'Playlist' : 'Album'}</p>

            <h1 className='text-3xl font-bold'>{list?.name}</h1>

            <p className='text-sm'>
              {`${artist || owner} `}
              {releaseYear && <>{` • ${releaseYear} • `}</>} {songCount}
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
            <li className='flex flex-col hover:bg-muted h-full py-0'>
              <div className='flex mx-4 items-center py-4'>
                <div className='flex gap-4 items-center mr-2'>
                  {song.id in likedIds ? (
                    <FaHeart
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
                  <button onClick={handleAddClick}>
                    <CirclePlus />
                  </button>
                </div>

                <div
                  className='flex w-full mx-4 items-center justify-evenly cursor-pointer'
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
                      {artist}
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

              {list?.songs[songCount - 1] === song ? (
                ''
              ) : (
                <hr className='border-muted w-[99%] self-center mt-4' />
              )}
            </li>
          ))
        ) : (
          <h2 className='text-center text-2xl mt-2'>No songs yet</h2>
        )}
      </ul>
    </div>
  );
}
