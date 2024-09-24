import { useState } from 'react';
import { Play } from 'lucide-react';
import { addToQueue, clearQueue, postToQueue } from '../../redux/playlists';
import { useDispatch } from 'react-redux';

export default function ListDetails({ list }) {
  const dispatch = useDispatch();
  const [songDurations, setSongDurations] = useState({});
  const artist = list?.artist
    ? list?.artist[0].band_name
      ? `${list?.artist[0].band_name}`
      : `${list?.artist[0].first_name} ${list?.artist[0].last_name}`
    : null;
  const releaseYear = new Date(list?.releaseDate).getFullYear() || null;
  const songCount = list?.songs?.length;

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
    if (list?.songs && list.songs.length > 0) {
      dispatch(clearQueue());

      const restructureSongs = list.songs.map(song => ({
        album: [
          {
            id: song.album_id,
            album_cover: list.albumCover,
          },
        ],
        albumId: song.album_id,
        artist: [
          {
            band_name: list.artist[0].band_name,
            first_name: list.artist[0].first_name,
            last_name: list.artist[0].last_name,
          },
        ],
        artistId: song.artist_id,
        id: song.id,
        name: song.name,
        url: song.url,
      }));

      restructureSongs.forEach(song => {
        dispatch(addToQueue(song));
      });
    } else {
      console.error('No songs to add to the queue');
    }
  };

  const playSong = song => {
    dispatch(clearQueue());

    const structuredSong = {
      album: [
        {
          id: song.album_id,
          album_cover: list.albumCover,
        },
      ],
      albumId: song.album_id,
      artist: [
        {
          band_name: list.artist[0]?.band_name || '',
          first_name: list.artist[0]?.first_name || '',
          last_name: list.artist[0]?.last_name || '',
        },
      ],
      artistId: song.artist_id,
      id: song.id,
      name: song.name,
      url: song.url,
    };

    dispatch(addToQueue(structuredSong));
  };

  if (!list) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className='container mt-14 xl:max-w-fit sm:max-w-5xl max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent'>
      <div className='mb-6 w-[80vw]'>
        <span className='flex gap-2 items-center'>
          <img
            src={list.albumCover}
            alt='album artwork'
          />

          <div className='flex flex-col justify-center space-y-1'>
            <p className='font-semibold'>Album</p>

            <h1 className='text-3xl font-bold'>{list?.name}</h1>

            <p className='text-sm'>
              {artist}
              {releaseYear && <>{` • ${releaseYear}`}</>} • {songCount}{' '}
              {`${songCount === 1 ? 'song' : 'songs'}`}
            </p>
            <p className='text-sm py-2 text-wrap w-4/5'>{list?.description}</p>
            <div className='flex'>
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

      <ul className='space-y-4 bg-card text-card-foreground w-full border border-border h-2/3 rounded-md py-4'>
        {list?.songs.length ? (
          list.songs.map(song => (
            <li className='flex flex-col'>
              <div
                className='flex mx-4 items-center justify-evenly cursor-pointer'
                onClick={() => playSong(song)}
              >
                <audio
                  src={song.url}
                  onLoadedMetadata={e => handleLoadedMetadata(song.id, e.target)}
                  className='hidden'
                />

                <div className='flex-1'>
                  <h3 className='font-semibold'>{song.name}</h3>
                </div>

                <div className='flex-1 text-center'>
                  <p className='text-sm'>{artist}</p>
                </div>

                <div className='flex-1 text-right'>
                  <p className='text-xs'>
                    {songDurations[song.id] ? formatTime(songDurations[song.id]) : '--:--'}
                  </p>
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
