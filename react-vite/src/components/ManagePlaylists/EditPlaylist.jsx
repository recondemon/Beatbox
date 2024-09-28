import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  CircleMinus,
  Save,
  X,
} from "lucide-react";
import {
  fetchLiked,
  selectLiked,
  fetchPlaylists,
  putPlaylist,
} from "../../redux/playlists";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtist } from "../../redux/artists";
import {
  selectCurrentSong,
} from "../../redux/queue";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop, useDrag, DndProvider } from "react-dnd";

{
  /* Able to move songs around, but unable to get backend to accept the changes. will need to add logs and trace the logic.  */
}
const ItemType = {
  SONG: "song",
};

const SongItem = ({
  song,
  index,
  moveSong,
  handleRemoveSong,
  artists,
  currentSong,
  handleLoadedMetadata,
  songDurations,
  formatTime,
}) => {
  const [, ref] = useDrag({
    type: ItemType.SONG,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.SONG,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSong(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <li
      ref={(node) => ref(drop(node))}
      className="flex items-center py-4 hover:bg-muted"
    >
      <div className="flex gap-4 mx-4">
        {/* Song number */}
        <div>{index + 1}.</div>
        {/* Remove song from playlist */}
        <button
          onClick={() => handleRemoveSong(song.id)}
          className="text-red-500 ml-2"
        >
          <CircleMinus />
        </button>
        {/* Buttons to reorder songs */}
        <button
          onClick={() => moveSong(index, index - 1)}
          className="text-gray-500"
        >
          <ChevronUp />
        </button>
        <button
          onClick={() => moveSong(index, index + 1)}
          className="text-gray-500"
        >
          <ChevronDown />
        </button>
      </div>
      {/* Song content */}
      <div className="flex w-full mx-2 items-center justify-evenly cursor-pointer">
        <audio
          src={song.url}
          onLoadedMetadata={(e) => handleLoadedMetadata(song.id, e.target)}
          className="hidden"
        />
        <div className="flex-1">
          <h3
            className={`font-semibold ${
              currentSong?.id === song.id ? "text-green-500" : ""
            }`}
          >
            {song.name}
          </h3>
        </div>
        <div className="flex-1 text-center">
          <p
            className={`font-semibold ${
              currentSong?.id === song.id ? "text-green-500" : ""
            }`}
          >
            {artists[song.artist_id]}
          </p>
        </div>
        <div className="flex-1 text-right">
          <p
            className={`font-semibold ${
              currentSong?.id === song.id ? "text-green-500" : ""
            }`}
          >
            {songDurations[song.id]
              ? formatTime(songDurations[song.id])
              : "--:--"}
          </p>
        </div>
      </div>
    </li>
  );
};

const EditPlaylist = ({ list, onClose }) => {
  const dispatch = useDispatch();
  const [artists, setArtists] = useState({});
  const [songDurations, setSongDurations] = useState({});
  const artist = list?.artist
    ? list?.artist[0].band_name
      ? `${list?.artist[0].band_name}`
      : `${list?.artist[0].first_name} ${list?.artist[0].last_name}`
    : null;
  const owner = list?.owner
    ? list?.owner[0].band_name
      ? `${list?.owner[0].band_name}`
      : `${list?.owner[0].first_name} ${list?.owner[0].last_name}`
    : null;
  const liked = useSelector(selectLiked);
  const currentSong = useSelector(selectCurrentSong);
  const coverArt = list?.albumCover || "/playlist.jpeg";
  const [playlistName, setPlaylistName] = useState(list?.name || "");
  const [description, setDescription] = useState(list?.description || "");
  const [isPublic, setIsPublic] = useState(list?.is_public || true);
  const [songs, setSongs] = useState(list?.songs || []);

  useEffect(() => {
    if (list?.songs) {
      const fetchArtists = async () => {
        const artistPromises = list?.songs?.map(async (song) =>
          dispatch(fetchArtist(song.artist_id))
        );

        const artistData = await Promise.all(artistPromises);
        const artists = {};

        artistData.forEach((artist) => {
          const artistName = artist.bandName
            ? artist.bandName
            : `${artist.firstName} ${artist.lastName}`;
          artists[artist.id] = artistName;
        });

        setArtists(artists);
      };

      fetchArtists();
    }
  }, [dispatch, list?.songs]);

  useEffect(() => {
    dispatch(fetchLiked());
    dispatch(fetchPlaylists());
  }, [dispatch]);

  const handleSave = () => {
    const updatedPlaylist = {
      id: list.id,
      name: playlistName,
      description,
      is_public: isPublic,
      songs: songs.map((song, index) => ({
        song_id: song.id,
        song_index: index,
      })),
    };
    dispatch(putPlaylist(updatedPlaylist));
    onClose();
  };

  const handleRemoveSong = (songId) => {
    dispatch(removeSongFromPlaylist(list.id, songId));
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
  };

  const moveSong = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= songs.length) return;
    const updatedSongs = [...songs];
    const [movedSong] = updatedSongs.splice(fromIndex, 1);
    updatedSongs.splice(toIndex, 0, movedSong);
    setSongs(updatedSongs);
  };

  const handleLoadedMetadata = (songId, audioElement) => {
    const duration = audioElement?.duration;

    setSongDurations((prevDurations) => ({
      ...prevDurations,
      [songId]: duration,
    }));
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!list) {
    return <h2>Loading...</h2>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mt-14 mx-44 overflow-x-clip max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent">
        <div className="mb-6 w-[80vw]">
          <span className="flex gap-2 items-center">
            <img
              className="max-w-56 max-h-56 rounded-md border border-accent"
              src={list?.name === "Liked" ? "/liked.jpeg" : coverArt}
              alt="album artwork"
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
                  onClick={onClose}
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
                  onChange={() => setIsPublic(!isPublic)}
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
        </div>
        {/* <ul className="bg-card text-card-foreground w-full border border-border h-2/3 rounded-md">
          {songs.length ? (
            songs.map((song, index) => (
              <SongItem
                key={song.id}
                song={song}
                index={index}
                moveSong={moveSong}
                handleRemoveSong={handleRemoveSong}
                artists={artists}
                currentSong={currentSong}
                handleLoadedMetadata={handleLoadedMetadata}
                songDurations={songDurations}
                formatTime={formatTime}
              />
            ))
          ) : (
            <h2 className="text-center text-2xl my-2">No songs yet</h2>
          )}
        </ul> */}
      </div>
    </DndProvider>
  );
};

export default EditPlaylist;
