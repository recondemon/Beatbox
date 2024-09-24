import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectPlaylistById, fetchPlaylist } from "../../../redux/playlists";
import { useEffect } from "react";
import ListDetails from "../../ListDetails";

const PlaylistDetails = () => {
  const dispatch = useDispatch();
  const { playlistId } = useParams();
  const playlist = useSelector(selectPlaylistById(playlistId));

  useEffect(() => {
    dispatch(fetchPlaylist(playlistId));
  }, [dispatch, playlistId]);

  if (!playlist) {
    return <h2 className="text-2xl font-bold">Loading...</h2>
  }

  return <ListDetails list={playlist} />;
};

export default PlaylistDetails;
