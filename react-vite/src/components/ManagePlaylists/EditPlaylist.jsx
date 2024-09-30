import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import {
  fetchMyPlaylist,
  putPlaylist,
  selectMyPlaylistById,
} from "../../redux/myPlaylists";
import { useDispatch, useSelector } from "react-redux";

const EditPlaylist = ({ playlistId, onSubmit }) => {
  const dispatch = useDispatch();

  const myPlaylist = useSelector(selectMyPlaylistById(playlistId));
  const [playlistName, setPlaylistName] = useState(myPlaylist?.name || "");
  const [description, setDescription] = useState(myPlaylist?.description || "");
  const [isPublic, setIsPublic] = useState(myPlaylist?.is_public || true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchMyPlaylist(playlistId));
  }, [playlistId]);

  const handleSave = () => {
    const updatedPlaylist = {
      id: myPlaylist.id,
      name: playlistName,
      description,
      is_public: isPublic,
    };
    try {
      dispatch(putPlaylist(updatedPlaylist)).then(() => onSubmit());
    } catch (err) {
      setErrors((prev) => ({ ...prev, ...err }));
    }
  };

  if (!myPlaylist) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="mt-14 mx-44 overflow-x-clip max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent">
      <div className="mb-6 w-[80vw]">
        <span className="flex gap-2 items-center">
          <img
            className="max-w-56 max-h-56 rounded-md border border-accent"
            src="/playlist.jpeg"
            alt="playlist artwork"
          />

          <div className="flex flex-col justify-center space-y-1">
            <div className="flex justify-end text-red-600">
              <button
                onClick={handleSave}
                className=" text-green-600 p-2 rounded-lg hover:bg-card hover:text-foreground rounded-lg"
              >
                <Save />
              </button>
              <button
                onClick={onSubmit}
                className="hover:bg-card hover:text-foreground p-2 rounded-lg"
              >
                <X />
              </button>
            </div>
            {/* Edit Playlist Name */}
            <label htmlFor="name">Name</label>
            <input
              id="name"
              title="name"
              type="text"
              className=""
              value={playlistName}
              placeholder="Playlist Name"
              onChange={(e) => setPlaylistName(e.target.value)}
            />

            {/* Set visiblity */}

            <div className="flex items-center mt-2">
              <label htmlFor="isPublic" className="mr-2">
                Public
              </label>
              <input
                id="isPublic"
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic((prev) => !prev)}
                className="toggle-checkbox"
              />
            </div>

            {/* Edit Playlist Description */}
            <textarea
              id="description"
              title="description"
              className="bg-input w-80 h-20 text-secondaryForeground rounded-lg"
              value={description}
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </span>
        <p className="text-destructive p-2">
          {Object.values(errors).join(", ")}
        </p>
      </div>
    </div>
  );
};

export default EditPlaylist;
