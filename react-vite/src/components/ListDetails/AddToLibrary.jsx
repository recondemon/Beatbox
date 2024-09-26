import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAdded,
  addSong,
  removeSongFromLibrary,
} from "../../redux/library";
import { Book, XIcon } from "lucide-react";

export default function AddToLibrary({ song }) {
  const isAdded = useSelector((state) => selectIsAdded(state, song.id));
  const dispatch = useDispatch();

  if (isAdded) {
    return (
      <XIcon
        className="hover:cursor-pointer hover:text-red-500"
        onClick={() => dispatch(removeSongFromLibrary(song))}
      />
    );
  }
  return (
    <Book
      className="hover:cursor-pointer hover:text-green-500"
      onClick={() => dispatch(addSong(song))}
    />
  );
}
