import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import { addPlaylist } from "../../redux/myPlaylists";

const CreatePlaylistForm = () => {
  const dispatch = useDispatch();
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");
  const { closeModal } = useModal();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!playlistName || !description) {
      setError("Playlist name and description are required.");
      return;
    }

    const playlistData = {
      name: playlistName,
      description,
      is_public: isPublic,
    };

    try {
      dispatch(addPlaylist(playlistData)).then((playlist) => {
        nav(`playlist/${playlist.id}`);
        closeModal();
      });
    } catch (err) {
      setError("An error occurred while creating the playlist.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <h1 className="text-2vw mb-5">Create Playlist</h1>
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="playlistName">Playlist Name</label>
          <input
            type="text"
            id="playlistName"
            name="playlistName"
            placeholder="Playlist Name"
            onChange={(e) => setPlaylistName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            className="bg-input text-secondaryForeground rounded-lg p-2"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="isPublic">Show playlist to public?</label>
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            onChange={() => setIsPublic(isPublic)}
          />
        </div>
        <button
          type="submit"
          className="flex bg-primary hover:bg-muted p-2 rounded-lg w-3/5 justify-center mx-auto mt-4"
        >
          Create Playlist
        </button>
        <p className="text-red-500">{error}</p>
      </form>
    </div>
  );
};

export default CreatePlaylistForm;
