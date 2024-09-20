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
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const artist = list.artist
    ? list.artist[0].band_name
      ? `${list.artist[0].band_name}`
      : `${list.artist[0].first_name} ${list.artist[0].last_name}`
    : null;

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLoadedMetadata = () => {
    const duration = audioRef.current.duration;

    setDuration(duration);

    setSongDurations(prevDurations => ({
      ...prevDurations,
      [currentSong.id]: duration,
    }));
  };

  const playSong = song => {
    setCurrentSong(song);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

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
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [currentSong]);

  return (
    // Song list
    <div className='flex flex-col h-[calc(100vh-48px)]'>
      <div className='flex-1 mx-44 overflow-y-auto p-8'>
        <h1 className='text-3xl font-bold mb-6'>{list.name}</h1>

        <ul className='space-y-4 bg-card text-card-foreground w-full border border-border h-2/3 rounded-md'>
          {list.songs.map(song => (
            <li
              key={song.id}
              className='flex border-b mx-4 border-accent-foreground items-center justify-between p-2 rounded cursor-pointer'
              onClick={() => playSong(song)}
            >
                <h3 className='font-semibold'>{song.name}</h3>

                <div className='text-sm'>{artist}</div>

                <div className='text-xs'>
                  {songDurations[song.id] ? formatTime(songDurations[song.id]) : '--:--'}
                </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Player */}
      <div className='p-4 flex items-center space-x-4 border-t border-accent'>
        <audio
          ref={audioRef}
          src={currentSong?.url}
          onLoadedMetadata={handleLoadedMetadata}
          className='hidden'
        />

        <div className='flex-shrink-0 w-48'>
          {/* TODO: Add album artwork and song artist*/}
          {currentSong && <h3 className='font-semibold'>{currentSong.name}</h3>}
        </div>

        <div className='flex-1 flex flex-col items-center'>
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
              max={duration || 1}
              value={currentTime}
              onChange={handleProgressChange}
              className='flex-1 h-1 rounded-lg appearance-none cursor-pointer'
            />

            <span className='text-xs w-10'>{formatTime(duration)}</span>
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
