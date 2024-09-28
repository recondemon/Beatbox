import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deletePlaylist } from "../../redux/myPlaylists";
import { useNavigate } from "react-router-dom";
export default function DeletePlaylistModal({playlistId}) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const nav = useNavigate();

  return (
    <div>
      <p>Are You Sure You want to delete this playlist?</p>
      <div className="flex justify-between">
        <button
          onClick={() => {
            dispatch(deletePlaylist(playlistId))
              .then(() => {
                closeModal();
                nav("/");
              })
              .catch((err) => {
                closeModal();
                alert(
                  "Filed To Delete Playlist " +
                    playlistId +
                    " due to the following errors: " +
                    Object.values(err).join(", ")
                );
              });
          }}
          className="text-green-300"
        >
          Yes
        </button>
        <button
          onClick={() => {
            closeModal();
          }}
          className="text-red-300"
        >
          No
        </button>
      </div>
    </div>
  );
}
