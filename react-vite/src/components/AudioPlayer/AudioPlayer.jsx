import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
} from 'lucide-react';

export default function AudioPlayer({ list }) {
  const [currentSong, setCurrentSong] = useState(list.songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [songDurations, setSongDurations] = useState({});
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const artist = list.artist
    ? list.artist[0].band_name
      ? `${list.artist[0].band_name}`
      : `${list.artist[0].first_name} ${list.artist[0].last_name}`
    : null;
  const releaseYear = new Date(list.releaseDate).getFullYear() || null;
  const songCount = list.songs?.length;

  console.log(list)

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Updates duration and stores it for each song, including current song
  const handleLoadedMetadata = (songId, audioElement) => {
    // FIXME: Optional chaining cuz I was getting a random null error...should probably fix that...
    const duration = audioElement?.duration;

    setSongDurations(prevDurations => ({
      ...prevDurations,
      [songId]: duration,
    }));
  };

  const playSong = song => {
    setCurrentSong(song);
    setIsPlaying(true);

    // setTimeout because the duration counter would be slightly out of sync otherwise
    setTimeout(() => {
      audioRef.current?.play();
    }, 0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handles time state change during a song & when scrubbing
  const handleProgressChange = e => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = e => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }

    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const currRef = audioRef.current;

    if (currRef) {
      currRef.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (currRef) {
        currRef.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [currentSong]);

  return (
    <div className='flex flex-col h-[calc(100vh-48px)]'>
      {/* TODO: Possibly extract this to a separate component */}
      <div className='flex-1 mx-44 overflow-y-auto p-8'>
        <div className='mb-6'>
          <span className='flex gap-2 items-center'>
            <h2 className='text-2xl font-bold'>{list.name}</h2>

            {releaseYear && <p className='text-sm'> • {releaseYear}</p>}

            <p className='text-sm'>
              {' '}
              • {songCount} {`${songCount === 1 ? 'song' : 'songs'}`}
            </p>
          </span>

          <p className='text-sm mt-1'>{list.description}</p>
        </div>

        {/* Song list */}
        <ul className='space-y-4 bg-card text-card-foreground w-full border border-border h-2/3 rounded-md py-2'>
          {list.songs.length ? (
            list.songs.map(song => (
              <li
                key={song.id}
                className='flex border-b mx-4 border-muted items-center justify-evenly p-2 cursor-pointer'
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
              </li>
            ))
          ) : (
            <h2 className='text-center text-2xl mt-2'>No songs yet</h2>
          )}
        </ul>
      </div>

      {/* Player */}
      <div className='p-4 flex items-center space-x-4 border-t border-accent'>
        {/* FIXME: Currently doesn't display default selected song duration until song starts playing */}
        <audio
          ref={audioRef}
          src={currentSong?.url}
          className='hidden'
        />

        <div className='flex-shrink-0 w-48'>
          {/* TODO: Add album artwork and song artist */}
          {currentSong && <h3 className='font-semibold'>{currentSong.name}</h3>}
        </div>

        <div className='flex-1 flex flex-col items-center'>
          {/* TODO: Add functionality to suffle, repeat, prev, and next */}
          <div className='flex items-center space-x-4 mb-2'>
            <button className=' '>
              <Shuffle size={20} />
            </button>

            <button className=' '>
              <SkipBack size={24} />
            </button>

            <button
              onClick={togglePlay}
              className='p-2 rounded-full scale-105 transition'
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button>
              <SkipForward size={24} />
            </button>

            <button>
              <Repeat size={20} />
            </button>
          </div>

          <div className='w-full flex items-center space-x-2'>
            <span className='text-xs  w-10 text-right'>{formatTime(currentTime)}</span>

            <input
              type='range'
              min={0}
              max={songDurations[currentSong?.id] || 1}
              value={currentTime}
              onChange={handleProgressChange}
              className='flex-1 h-1 rounded-lg appearance-none cursor-pointer'
            />

            <span className='text-xs w-10'>{formatTime(songDurations[currentSong?.id])}</span>
          </div>
        </div>

        <div className='w-32 flex items-center flex-shrink-0 space-x-2'>
          <button
            onClick={toggleMute}
            className=' '
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <input
            type='range'
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className='w-20 h-1 rounded-lg appearance-none cursor-pointer'
          />
        </div>
      </div>
    </div>
  );
}
