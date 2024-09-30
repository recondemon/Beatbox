import { useEffect, useRef, useState } from "react";
import { Trash, MoreHorizontal, Play, CircleMinus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToQueue,
  clearQueue,
  selectCurrentSong,
} from "../../../redux/queue";
import { fetchArtist } from "../../../redux/artists";
import LikeButton from "../../ListDetails/LikeButton";
import AddToLibrary from "../../ListDetails/AddToLibrary";
import EditPlaylist from "../../ManagePlaylists/EditPlaylist";
import DropDown from "../../ListDetails/DropDown";
import DeletePlaylistModal from "../../ListDetails/DeletePlaylistModal";
import { useModal } from "../../../context/Modal";
import { useParams } from "react-router-dom";
import {
  fetchMyPlaylist,
  removeSongFromPlaylist,
  selectMyPlaylistById,
  selectMyPlaylistsArray,
} from "../../../redux/myPlaylists";
import { fetchPlaylist, selectPlaylistById } from "../../../redux/playlists";
import ListItem from "../../ListDetails/ListItem";
import { fetchAllSongs } from "../../../redux/songs";

const PlaylistDetails = () => {
  const dispatch = useDispatch();
  const [editingPlaylist, setEditingPlaylist] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.session.user);
  const { playlistId } = useParams();
  const myPlaylists = useSelector(selectMyPlaylistsArray);
  const myPlaylist = useSelector(selectMyPlaylistById(playlistId));
  const playlist = useSelector(selectPlaylistById(playlistId));
  const isInMyPlaylists = myPlaylists?.some(
    (playlist) => playlist.id == playlistId
  );
  const activePlaylist = isInMyPlaylists ? myPlaylist : playlist;
  const [showAlert, setShowAlert] = useState(false);
  const dropdownRef = useRef(null);
  const { setModalContent } = useModal();
  const coverArt = "/playlist.jpeg";

  useEffect(() => {
    if (playlistId) {
      dispatch(fetchPlaylist(playlistId));
      dispatch(fetchMyPlaylist(playlistId));
    }
  }, [dispatch, playlistId]);

  const handlePlayAllSongs = () => {
    if (playlist.songs?.length > 0) {
      dispatch(clearQueue()).then(() => {
        playlist.songs.forEach((song, index) => {
          console.log("adding", song.name, index);
          dispatch(addToQueue(song));
        });
      });
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEditPlaylist = () => {
    if (user?.id === playlist.ownerId) {
      setEditingPlaylist(true);
      setMenuOpen(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleCloseEdit = () => {
    setEditingPlaylist(false);
  };

  if (editingPlaylist) {
    return <EditPlaylist playlistId={playlist.id} onSubmit={handleCloseEdit} />;
  }

  return (
    <div className="mt-14 mx-44 overflow-x-clip max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent">
      <div className="mb-6 w-[80vw] relative">
        <span className="flex gap-2 items-center">
          <img
            className="max-w-56 max-h-56 rounded-md border border-accent"
            src={
              activePlaylist?.name === "Liked"
                ? "/liked.jpeg"
                : activePlaylist?.name === "Library"
                ? "/library.jpeg"
                : coverArt
            }
            alt="album artwork"
          />

          <div className="flex flex-col justify-center space-y-1">
            <div className="flex justify-between items-center space-y-1 relative">
              <p className="flex font-semibold justify-start">Playlist</p>

              <div>
                <button onClick={toggleMenu} className="relative">
                  <MoreHorizontal
                    className="text-primary cursor-pointer hover:bg-muted rounded-lg hover:text-foreground"
                    size={30}
                  />
                </button>

                <button
                  onClick={() => {
                    setModalContent(
                      <DeletePlaylistModal playlistId={playlistId} />
                    );
                  }}
                  className="relative"
                >
                  {activePlaylist?.ownerId === user.id && (
                    <Trash
                      className="ml-2 text-destructive cursor-pointer hover:bg-muted rounded-lg hover:text-foreground"
                      size={30}
                    />
                  )}
                </button>
              </div>

              {menuOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute text-foreground bg-card right-0 top-6 mt-2 rounded-lg shadow-lg z-10 p-2 w-1/2"
                >
                  <ul>
                    <li>
                      <button
                        onClick={handleEditPlaylist}
                        className="block px-4 py-2 text-sm w-full text-center hover:bg-muted rounded-lg"
                      >
                        Edit Playlist
                      </button>
                    </li>
                    <li>
                      <button className="block px-4 py-2 text-sm w-full text-center hover:bg-muted rounded-lg">
                        Create New Playlist
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              {showAlert && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                  <div className="bg-card p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold">Permission Denied</h3>
                    <p className="mt-2">
                      You don't have permission to edit this playlist.
                    </p>
                    <button
                      onClick={handleCloseAlert}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold">{activePlaylist?.name}</h1>
            <p className="text-sm text-wrap w-fit">
              {activePlaylist?.description}
            </p>
          </div>

          <div className="absolute bottom-2 left-40 ml-2">
            <button
              className="p-3 bg-green-500 w-fit rounded-lg"
              onClick={handlePlayAllSongs}
            >
              <Play />
            </button>
          </div>
        </span>
      </div>

      <ul className="bg-card text-card-foreground w-full border border-border h-2/3 rounded-md">
        {activePlaylist?.songs?.length ? (
          activePlaylist.songs?.map((song, index) => (
            <ListItem
              songId={song.id}
              isMyPlaylist={isInMyPlaylists}
              key={index}
            />
          ))
        ) : (
          <h2 className="text-center text-2xl my-2">No songs yet</h2>
        )}
      </ul>
    </div>
  );
};

export default PlaylistDetails;
