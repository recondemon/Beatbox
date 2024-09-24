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
import { selectQueue, setCurrentSongIndex, selectCurrentSongIndex, fetchQueue } from "../../redux/playlists";

export default function AudioPlayer() {
  const dispatch = useDispatch();
  const list = useSelector(selectQueue);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(
    JSON.parse(localStorage.getItem('isPlaying')) || false
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [lastSong, setLastSong] = useState(false);
  const currentSongIndex = useSelector(selectCurrentSongIndex);
  const audioRef = useRef(null);
  const manualPlayTriggered = useRef(false); 

const handleTimeUpdate = () => {
  if (audioRef.current) {
    setCurrentTime(audioRef.current.currentTime);
  }
};

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
  }, [currentSong, isRepeating]);
  
  useEffect(() => {
    const persistedIsPlaying = JSON.parse(localStorage.getItem('isPlaying'));
    if (persistedIsPlaying !== null) {
      setIsPlaying(persistedIsPlaying);
    }
  }, []);

  useEffect(() => {
    console.log("FETCHING QUEUE")
    dispatch(fetchQueue());
  }, [dispatch]);

  useEffect(() => {
    if (list.length > 0 && currentSongIndex !== undefined && currentSongIndex !== null) {
      const song = list[currentSongIndex];
      setCurrentSong(song);
      if (audioRef.current && song?.url) {
        audioRef.current.src = song.url;
        audioRef.current.load();
  
        if (manualPlayTriggered.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch((error) => {
            console.error("Auto play failed:", error);
          });
          manualPlayTriggered.current = false;
        }
      }
    }
  }, [list, currentSongIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
  
    if (isPlaying) {
      audioRef.current.pause();
      localStorage.setItem('isPlaying', JSON.stringify(false));
    } else {
      manualPlayTriggered.current = true; 
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
      localStorage.setItem('isPlaying', JSON.stringify(true));
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
        let newIndex;
        
        if (currentSongIndex === 0) {
          newIndex = list.length - 1;
        } else {
          newIndex = currentSongIndex - 1;
        }
        
        dispatch(setCurrentSongIndex(newIndex));
      } else {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const skipForward = () => {
    if (!list || list.length === 0) return;
  
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

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  useEffect(() => {
    if (
      list?.length > 0 &&
      currentSongIndex !== undefined &&
      currentSongIndex !== null
    ) {
      const selectedSong = list[currentSongIndex];
      setCurrentSong(selectedSong);
      setCurrentTime(0);

      if (audioRef.current && selectedSong?.url) {
        console.log("Setting audio source to:", selectedSong.url);
        audioRef.current.src = selectedSong.url;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            console.log("Audio started playing successfully");
          })
          .catch((error) => {
            console.error("Auto play failed:", error);
          });
      }
    } else {
      console.log("No valid song found at the current index.");
    }
  }, [currentSongIndex, list]);

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
  }, [currentSong, isRepeating]);

  return (
    <div className="p-4 flex items-center bg-background fixed bottom-0 left-0 right-0 space-x-4 border-t border-accent">
      <audio ref={audioRef} className="hidden" />

      <div className="flex w-60">
        {currentSong ? (
          <div className="flex">
            <div className="w-12 h-12">
              <img
                src={currentSong?.album[0].album_cover}
                alt={currentSong?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold">{currentSong?.name}</h3>
              <p>{currentSong?.artist[0].band_name}</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No song selected</div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={toggleShuffle}>
            <Shuffle
              size={20}
              className={isShuffling ? "text-green-500" : ""}
            />
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

        <div className="w-full flex items-center space-x-2">
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

      <div className="w-32 flex items-center flex-shrink-0 space-x-2">
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
