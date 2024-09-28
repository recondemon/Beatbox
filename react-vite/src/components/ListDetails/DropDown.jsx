import { useSelector } from "react-redux";
import { selectMyPlaylistsArray } from "../../redux/myPlaylists";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addSong } from "../../redux/myPlaylists";
import { CirclePlus } from "lucide-react";

export default function DropDown({ song }) {
  const myPlaylists = useSelector(selectMyPlaylistsArray);
  const [isVisible, setIsVisible] = useState();
  const dispatch = useDispatch();
  const dropDownRef = useRef();

  function handleClick(playlistId) {
    setIsVisible(false);
    dispatch(addSong(playlistId, song));
  }

  function handleClickOutside(e) {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
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
    <div>
      <button onClick={() => setIsVisible(true)}>
        <CirclePlus />
      </button>

      {isVisible && (
        <div
          ref={dropDownRef}
          className="absolute z-10 origin-top-left w-56 rounded-md bg-background shadow-lg"
        >
          {myPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="p-2 hover:bg-muted cursor-pointer"
            >
              <span
                className="text-sm"
                key={playlist.id}
                onClick={() => handleClick(playlist.id)}
              >
                Add to {playlist.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
