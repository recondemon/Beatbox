import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchMyPlaylists,
  selectMyPlaylistsArray,
} from "../../../redux/myPlaylists";
import { selectLikedPlaylist, fetchLikedPlaylist } from "../../../redux/liked";
import { fetchLibrary, selectLibraryPlaylist } from "../../../redux/library";
import { useEffect, useState } from "react";
import { SquarePlus } from "lucide-react";
import CreatePlaylistModal from "../../ManagePlaylists/CreatePlaylistModal";
import CreatePlaylistForm from "../../ManagePlaylists/CreatePlaylistForm";

const Sidebar = () => {
  const user = useSelector((state) => state.session.user);
  const playlistsArray = useSelector(selectMyPlaylistsArray);
  const liked = useSelector(selectLikedPlaylist);
  const library = useSelector(selectLibraryPlaylist);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLikedPlaylist());
    dispatch(fetchLibrary());
    dispatch(fetchMyPlaylists());
  }, [dispatch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!user) {
    return;
  }

  return (
    <div className="absolute top-20 left-4">
      <div className="flex flex-col h-full bg-popover rounded-md">
        <div className="flex flex-col p-4">
          <button
            onClick={handleOpenModal}
            className="bg-card flex justify-center items-center rounded-md"
          >
            <SquarePlus className='text-primary bg-card' size={54}/>
          </button>
        </div>
        <div className="flex flex-col p-4 gap-4">
          <Link to={`/playlist/${library.id}`}title={library?.name}>
            <img
              className="w-12 h-12 rounded-md border border-accent"
              src="/liked.jpeg"
              alt="heart logo for favorites playlist"
            />
          </Link>
        </div>
        <div className="flex flex-col p-4 gap-4">
          <Link to={`/playlist/${liked.id}`} title={liked?.name}>
            <img
              className="w-12 h-12 rounded-md border border-accent"
              src="/liked.jpeg"
              alt="heart logo for favorites playlist"
            />
          </Link>
        </div>

        {playlistsArray?.map((playlist) => (
          <div key={playlist?.id} className="flex flex-col p-4 gap-4">
            <Link to={`/playlist/${playlist?.id}`} title={playlist?.name}>
              <img
                className="w-12 h-12 rounded-md border border-accent"
                src="/playlist.jpeg"
                alt="heart logo for favorites playlist"
              />
            </Link>
          </div>
        ))}
      </div>

      <CreatePlaylistModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <CreatePlaylistForm />
      </CreatePlaylistModal>

    </div>
  );
};

export default Sidebar;
