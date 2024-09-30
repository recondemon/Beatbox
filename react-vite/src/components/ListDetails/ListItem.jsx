import { useDispatch, useSelector } from "react-redux";
import { selectSongById } from "../../redux/songs";
import { useEffect, useState } from "react";
import AddToLibrary from "./AddToLibrary";
import LikeButton from "./LikeButton";
import DropDown from "./DropDown";
import { useParams } from "react-router-dom";
import { CircleMinus } from "lucide-react";
import { addToQueue, clearQueue, selectCurrentSong } from "../../redux/queue";
import { removeSongFromPlaylist } from "../../redux/myPlaylists";

export default function ListItem({ songId, isMyPlaylist = false }) {
  const { playlistId } = useParams();
  const song = useSelector(selectSongById(songId));
  const currentSong = useSelector(selectCurrentSong);
  const [duration, setDuration] = useState(0);
  const dispatch = useDispatch();

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const playSong = (song) => {
    dispatch(clearQueue()).then(() => dispatch(addToQueue(song)));
  };

  return (
    <li className="flex flex-col hover:bg-muted h-full rounded-sm">
      <div className="flex mx-4 items-center py-4">
        <div className="flex gap-4 items-center mr-2">
          {isMyPlaylist && (
            <button
              onClick={() => dispatch(removeSongFromPlaylist(song, playlistId))}
            >
              <CircleMinus />
            </button>
          )}

          <AddToLibrary song={song} />

          <LikeButton song={song} />

          <DropDown song={song} />
        </div>

        <div
          className="flex w-full mx-2 items-center justify-evenly cursor-pointer"
          onClick={() => playSong(song)}
        >
          <audio
            src={song?.url}
            onLoadedMetadata={(e) => setDuration(e.target?.duration)}
            className="hidden"
          />

          <div className="flex-1">
            <h3
              className={`font-semibold ${
                currentSong?.id === song?.id ? "text-green-500" : ""
              }`}
            >
              {song?.name}
            </h3>
          </div>

          <div className="flex-1 text-center">
            <p
              className={`font-semibold ${
                currentSong?.id === song?.id ? "text-green-500" : ""
              }`}
            >
              {song?.artist?.[0]?.band_name}
            </p>
          </div>

          <div className="flex-1 text-right">
            <p
              className={`font-semibold ${
                currentSong?.id === song?.id ? "text-green-500" : ""
              }`}
            >
              {duration ? formatTime(duration) : "--:--"}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
