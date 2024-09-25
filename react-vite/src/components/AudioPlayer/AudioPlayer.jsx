import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectQueue, setCurrentSongIndex, selectCurrentSongIndex } from "../../redux/playlists";


export default function AudioPlayer() {
  const dispatch = useDispatch();
  const list = useSelector(selectQueue);
  const queue = useSelector(selectQueue);
  const currentSongIndex = useSelector(selectCurrentSongIndex);
  const currentSong = queue?.[currentSongIndex];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [lastSong, setLastSong] = useState(false);

  const audioRef = useRef(null);
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.url;
      audioRef.current.play();
    }
  }, [currentSong]);

  useEffect(() => {
    if (list.length > 0 && currentSongIndex !== null && currentSongIndex !== undefined) {
      const song = list[currentSongIndex];
      if (audioRef.current && song?.url) {
        audioRef.current.src = song.url;
        audioRef.current.load();
        audioRef.current.play().then(() => setIsPlaying(true)).catch(error => console.error("Auto play failed:", error));
      }
    }
  }, [list, currentSongIndex]);

  useEffect(() => {
    const currRef = audioRef.current;
    if (currRef) {
      currRef.addEventListener("timeupdate", handleTimeUpdate);
      currRef.addEventListener("ended", () => {
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
        currRef.removeEventListener("timeupdate", handleTimeUpdate);
        currRef.removeEventListener("ended", skipForward);
      }
    };
  }, [isRepeating]);

  const togglePlay = () => {
    if (!audioRef.current) return;
  
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => console.error("Failed to play audio:", error));
    }
    setIsPlaying(!isPlaying);
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
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const skipBack = () => {
    if (currentTime >= 5) {
      audioRef.current.currentTime = 0;
    } else {
      if (list.length > 1) {
        const newIndex = currentSongIndex === 0 ? list.length - 1 : currentSongIndex - 1;
        dispatch(setCurrentSongIndex(newIndex));
      } else {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const skipForward = () => {
    if (list.length === 1) {
      setLastSong(true);
      return;
    }

    if (currentSongIndex === list.length - 1 && !isRepeating) {
      setLastSong(true);
      return;
    }

    setLastSong(false);

    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * list.length);
      dispatch(setCurrentSongIndex(randomIndex));
    } else {
      const nextIndex = (currentSongIndex + 1) % list.length;
      dispatch(setCurrentSongIndex(nextIndex));
    }
  };

  const toggleShuffle = () => setIsShuffling(!isShuffling);

  const toggleRepeat = () => setIsRepeating(!isRepeating);

  return (
    <div className="p-4 grid grid-cols-4 items-center bg-background fixed bottom-0 left-0 right-0 space-x-4 border-t border-accent">
      <audio ref={audioRef} className="hidden" />

      <div className="flex w-full">
        {currentSong ? (
          <div className="flex gap-4">
            <div className="w-12 h-12">
              <img
                src={currentSong?.album[0].album_cover}
                alt={currentSong?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-nowrap overflow-x-hidden">{currentSong?.name}</h3>
              <p>{currentSong?.artist[0].band_name}</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No song selected</div>
        )}
      </div>

      <div className="col-span-2 flex-1 flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={toggleShuffle}>
            <Shuffle size={20} className={isShuffling ? "text-green-500" : ""} />
          </button>

          <button onClick={skipBack}>
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlay}
            className="p-2 rounded-full scale-105 transition"
            disabled={!currentSong}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button onClick={skipForward} disabled={lastSong}>
            <SkipForward size={24} />
          </button>

          <button onClick={toggleRepeat}>
            <Repeat size={20} className={isRepeating ? "text-green-500" : ""} />
          </button>
        </div>

        <div className="w-[50vw] flex items-center space-x-2">
          <span className="text-xs w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={audioRef.current?.duration || 1}
            value={currentTime}
            onChange={handleProgressChange}
            className="flex-1 h-1 rounded-lg appearance-none cursor-pointer"
            disabled={!currentSong}
          />

          <span className="text-xs w-10">
            {formatTime(audioRef.current?.duration || 0)}
          </span>
        </div>
      </div>

      <div className="col-span-1 w-full mx-auto flex items-center justify-center space-x-2">
        <button onClick={toggleMute}>
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}
