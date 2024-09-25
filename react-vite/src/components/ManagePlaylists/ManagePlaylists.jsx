import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPlaylistById,
  fetchPlaylist,
  putPlaylist,
} from "../../redux/playlists";
import { useEffect, useState } from "react";
export default function ManagePlaylists() {
  const { playlistId } = useParams();
  const playlist = useSelector(selectPlaylistById(playlistId));
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPlaylist(playlistId));
  }, [dispatch, playlistId]);

  useEffect(() => {
    setName(playlist?.name);
    setDescription(playlist?.description);
    setIsPublic(playlist?.isPublic);
  }, [playlist]);

  const [name, setName] = useState(playlist?.name || "");
  const [description, setDescription] = useState(playlist?.description || "");
  const [isPublic, setIsPublic] = useState(playlist?.isPublic || false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    console.log({
      id: playlist?.id,
      name,
      description,
      isPublic,
      ownerId: user?.id,
    });
  }, [name, description, isPublic]);

  function submit() {
    try {
      dispatch(
        putPlaylist({
          id: playlist?.id,
          name,
          description,
          is_public: isPublic,
          ownerId: user?.id,
        })
      );
    } catch (err) {
      setErrors(err?.errors || { errors: "Something went wrong" });
    }
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col w-3/6 justify-self-center m-auto gap-10 items-center"
    >
      <div className="flex flex-col items-center gap-2">
        <h3 className="w-max">Playlist Name</h3>
        <input
          type="text"
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3>Describe your playlist</h3>
        <textarea
          className="w-64 h-64 p-5 bg-secondary scrollbar-hide resize-none"
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </div>

      <div className="flex gap-5">
        <h3>Do you want your playlist to be public?</h3>
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={() => setIsPublic((prev) => !prev)}
        />
      </div>
      {errors &&
        Object.keys(errors).forEach((error) => <div>{errors[error]}</div>)}
      <button>Save Changes</button>
    </form>
  );
}
