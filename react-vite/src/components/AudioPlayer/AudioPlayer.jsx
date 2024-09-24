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

export default function AudioPlayer({ list, currentSongIndex, setCurrentSongIndex }) {
  const songs = list?.songs || [];
  const [currentSong, setCurrentSong] = useState(songs[currentSongIndex] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skipBack = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === 0 ? songs.length - 1 : prevIndex - 1));
  };

  const skipForward = () => {
    if (isShuffling) {
      setCurrentSongIndex(Math.floor(Math.random() * songs.length));
    } else {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    }
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  useEffect(() => {
    const currRef = audioRef.current;

    if (currRef) {
      currRef.addEventListener('timeupdate', handleTimeUpdate);
      currRef.addEventListener('ended', () => {
        if (isRepeating) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        } else {
          skipForward();
        }
      });

      currRef.addEventListener('canplaythrough', () => {
        if (isPlaying) {
          currRef.play().catch((error) => {
            console.error("Auto play failed:", error);
          });
        }
      });
    }

    return () => {
      if (currRef) {
        currRef.removeEventListener('timeupdate', handleTimeUpdate);
        currRef.removeEventListener('ended', skipForward);
        currRef.removeEventListener('canplaythrough', togglePlay);
      }
    };
  }, [currentSong, isRepeating]);

  useEffect(() => {
    setCurrentSong(songs[currentSongIndex] || null);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.load();
      setIsPlaying(false);
    }
  }, [currentSongIndex, songs]);

  return (
    <div className='p-4 flex items-center bg-background fixed bottom-0 left-0 right-0 space-x-4 border-t border-accent'>
      <audio ref={audioRef} src={currentSong?.url} className='hidden' />

      <div className='flex-shrink-0 w-48'>
        <img src={currentSong?.albumCover} alt={currentSong?.name} className="w-full h-full object-cover" />
        <h3 className='font-semibold'>{currentSong?.name}</h3>
        <p>{currentSong?.artistName}</p>
      </div>

      <div className='flex-1 flex flex-col items-center'>
        <div className='flex items-center space-x-4 mb-2'>
          <button onClick={toggleShuffle}>
            <Shuffle size={20} className={isShuffling ? 'text-green-500' : ''} />
          </button>

          <button onClick={skipBack}>
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlay}
            className='p-2 rounded-full scale-105 transition'
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button onClick={skipForward}>
            <SkipForward size={24} />
          </button>

          <button onClick={toggleRepeat}>
            <Repeat size={20} className={isRepeating ? 'text-green-500' : ''} />
          </button>
        </div>

        <div className='w-full flex items-center space-x-2'>
          <span className='text-xs w-10 text-right'>{formatTime(currentTime)}</span>

          <input
            type='range'
            min={0}
            max={audioRef.current?.duration || 1}
            value={currentTime}
            onChange={handleProgressChange}
            className='flex-1 h-1 rounded-lg appearance-none cursor-pointer'
          />

          <span className='text-xs w-10'>{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
      </div>

      <div className='w-32 flex items-center flex-shrink-0 space-x-2'>
        <button onClick={toggleMute}>
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
  );
}
