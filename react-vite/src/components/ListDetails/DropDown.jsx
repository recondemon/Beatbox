import { useSelector } from "react-redux";
import {
  addSongToPlaylist,
  selectMyPlaylistsArray,
} from "../../redux/myPlaylists";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { CirclePlus } from "lucide-react";
import { useParams } from "react-router-dom";

export default function DropDown({ song }) {
  const myPlaylists = useSelector(selectMyPlaylistsArray);
  const { playlistId: paramPlaylistId } = useParams();
  const [isVisible, setIsVisible] = useState();
  const dispatch = useDispatch();
  const dropDownRef = useRef();

  function handleClick(playlistId) {
    const playlist = myPlaylists.find(({ id }) => id == playlistId);
    if (playlist.songs.some((addedSongs) => song.id == addedSongs.id)) {
      alert(`You already have that song in your ${playlist.name} playlist`);
    } else {
      try {
        dispatch(addSongToPlaylist(song, playlistId));
      } catch (err) {
        alert("ERROR", err.message);
      }
    }
    document.removeEventListener("mousedown", handleClickOutside);
    setIsVisible(false);
  }

  function handleClickOutside(e) {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      document.removeEventListener("mousedown", handleClickOutside);
      setIsVisible(false);
    }
  }

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className="overflow-y-auto">
      <button onClick={() => setIsVisible(true)}>
        <CirclePlus />
      </button>

      {isVisible && (
        <div
          ref={dropDownRef}
          className="absolute z-10 origin-top-left w-56 rounded-md bg-background shadow-lg"
        >
          {myPlaylists
            .filter(({ id }) => id != paramPlaylistId)
            .map((playlist) => (
              <div
                key={playlist.id}
                className="p-2 hover:bg-muted cursor-pointer"
                onClick={() => handleClick(playlist.id)}
              >
                <span className="text-sm" key={playlist.id}>
                  Add to {playlist.name}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
