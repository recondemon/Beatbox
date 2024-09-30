import { useDispatch, useSelector } from "react-redux";
import { selectSongById } from "../../redux/songs";
import { useState } from "react";
import AddToLibrary from "./AddToLibrary";
import LikeButton from "./LikeButton";
import DropDown from "./DropDown";

export default function ListItem({ songId }) {
  const song = useSelector(selectSongById(songId));
  const [duration, setDuration] = useState(0);

  return (
    <li
      key={index + "1"}
      className="flex flex-col hover:bg-muted h-full rounded-sm"
    >
      <div className="flex mx-4 items-center py-4">
        <div className="flex gap-4 items-center mr-2">
          <AddToLibrary key={index + "2"} song={song} />

          <LikeButton key={index + "3"} song={song} />

          <DropDown song={song} />
        </div>

        <div
          className="flex w-full mx-2 items-center justify-evenly cursor-pointer"
          onClick={() => playSong(song)}
        >
          <audio
            src={song.url}
            onLoadedMetadata={(e) => setDuration(e.target?.duration)}
            className="hidden"
          />

          <div className="flex-1">
            <h3
              className={`font-semibold ${
                currentSong?.id === song.id ? "text-green-500" : ""
              }`}
            >
              {song.name}
            </h3>
          </div>

          <div className="flex-1 text-center">
            <p
              className={`font-semibold ${
                currentSong?.id === song.id ? "text-green-500" : ""
              }`}
            >
              {artist}
            </p>
          </div>

          <div className="flex-1 text-right">
            <p
              className={`font-semibold ${
                currentSong?.id === song.id ? "text-green-500" : ""
              }`}
            >
              {songDurations[song.id]
                ? formatTime(songDurations[song.id])
                : "--:--"}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
