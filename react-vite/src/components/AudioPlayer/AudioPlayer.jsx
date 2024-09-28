import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  playRandom,
  fetchQueue,
  selectCurrentSong,
  playNext,
  playPrev,
  loop,
  reverseLoop,
} from '../../redux/queue';
import { fetchSong } from '../../redux/songs';

export default function AudioPlayer() {
  const dispatch = useDispatch();
  const currentSong = useSelector(selectCurrentSong);
  const [songDetails, setSongDetails] = useState(currentSong);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const audioRef = useRef(new Audio());
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(fetchQueue());
  }, [dispatch]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong?.url;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Auto play failed:', error));
    }
    if (currentSong?.id) {
      dispatch(fetchSong(currentSong.id)).then(setSongDetails);
    }
  }, [currentSong]);

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
    }

    return () => {
      if (currRef) {
        currRef.removeEventListener('timeupdate', handleTimeUpdate);
        currRef.removeEventListener('ended', skipForward);
      }
    };
  }, [isRepeating]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => console.error('Failed to play audio:', error));
    }
    setIsPlaying(!isPlaying);
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

  const startSongOver = () => {
    audioRef.current.currentTime = 0;
  };

  const skipBack = () => {
    if (currentSong?.isFirst) {
      if (isRepeating) {
        dispatch(reverseLoop());
      } else {
        startSongOver();
      }
    } else if (currentTime >= 5 || isRepeatOne) {
      startSongOver();
    } else {
      dispatch(playPrev());
    }
  };

  const skipForward = () => {
    if (isRepeatOne) {
      startSongOver();
    } else if (currentSong?.isLast) {
      if (isRepeating) {
        dispatch(loop());
      } else {
        setIsPlaying(false);
      }
    } else if (isShuffling) {
      dispatch(playRandom());
    } else {
      dispatch(playNext());
    }
  };

  const toggleShuffle = () => setIsShuffling(!isShuffling);

  const toggleRepeat = () => {
    if (isRepeatOne) {
      setIsRepeating(false);
      setIsRepeatOne(false);
    } else if (isRepeating) {
      setIsRepeatOne(true);
      setIsRepeating(false);
    } else {
      setIsRepeating(true);
      setIsRepeatOne(false);
    }
  };

  return (
    <div
      className={
        user
          ? 'p-4 grid grid-cols-4 items-center bg-background fixed bottom-0 left-0 right-0 space-x-4 border-t border-accent'
          : 'hidden'
      }
    >
      <audio
        ref={audioRef}
        className='hidden'
      />

      <div className='flex w-full'>
        {currentSong ? (
          <div className='flex gap-4'>
            <div className='w-12 h-12'>
              <img
                src={songDetails?.album?.[0].album_cover}
                alt={currentSong?.name}
                className='w-full h-full object-cover rounded-md border border-accent'
              />
            </div>
            <div className='flex flex-col'>
              <h3 className='font-semibold text-nowrap overflow-x-hidden'>{currentSong?.name}</h3>
              <p>{songDetails?.artist?.[0].band_name}</p>
            </div>
          </div>
        ) : (
          <div className='text-gray-500'>No song selected</div>
        )}
      </div>

      <div className='col-span-2 flex-1 flex flex-col items-center'>
        <div className='flex items-center space-x-4 mb-2'>
          <button onClick={toggleShuffle}>
            <Shuffle
              size={20}
              className={isShuffling ? 'text-green-500' : ''}
            />
          </button>

          <button onClick={skipBack}>
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlay}
            className='p-2 rounded-full scale-105 transition'
            disabled={!currentSong}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            onClick={skipForward}
            disabled={currentSong?.isLast && !isRepeating && !isRepeatOne}
          >
            <SkipForward
              size={24}
              className={
                currentSong?.isLast && !isRepeating && !isRepeatOne ? 'text-secondary' : ''
              }
            />
          </button>

          <button onClick={toggleRepeat}>
            {isRepeatOne ? (
              <Repeat1
                size={20}
                className='text-green-500'
              />
            ) : (
              <Repeat
                size={20}
                className={isRepeating ? 'text-green-500' : ''}
              />
            )}
          </button>
        </div>

        <div className='w-[50vw] flex items-center space-x-2'>
          <span className='text-xs w-10 text-right'>{formatTime(currentTime)}</span>

          <input
            type='range'
            min={0}
            max={audioRef.current?.duration || 1}
            value={currentTime}
            onChange={handleProgressChange}
            className='flex-1 h-1 rounded-lg appearance-none cursor-pointer'
            disabled={!currentSong}
          />

          <span className='text-xs w-10'>{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
      </div>

      <div className='col-span-1 w-full mx-auto flex items-center justify-center space-x-2'>
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
