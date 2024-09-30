import { useDispatch, useSelector } from "react-redux";
import { selectSongById } from "../../redux/songs";

export default function ListItem({ songId }) {
  const song = useSelector(selectSongById(songId));

  

}
