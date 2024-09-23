import { useState } from 'react';

export default function ListDetails({ list }) {
  const [currentSong, setCurrentSong] = useState(list?.songs[0]);
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

  const playSong = song => {
    setCurrentSong(song);
    setIsPlaying(true);

    // setTimeout because the duration counter would be slightly out of sync otherwise
    setTimeout(() => {
      audioRef.current?.play();
    }, 0);
  };

  if (!list) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className='container mt-14 max-h-[calc(100vh-200px)] overflow-y-auto'>
      <div className='mb-6'>
        <span className='flex gap-2 items-center'>
          <h2 className='text-2xl font-bold'>{list?.name}</h2>

          {releaseYear && <p className='text-sm'> • {releaseYear}</p>}

          <p className='text-sm'>
            {' '}
            • {songCount} {`${songCount === 1 ? 'song' : 'songs'}`}
          </p>
        </span>

        <p className='text-sm mt-1'>{list?.description}</p>
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

              {list.songs[list.songs.length - 1] === song ? (
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
