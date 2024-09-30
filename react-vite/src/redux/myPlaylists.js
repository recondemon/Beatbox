import { post, del, get, put } from "./csrf";
import { loadOne } from "./playlists";

/* ACTION TYPES */

const LOAD_PLAYLISTS = "myPlaylist/loadPlaylists";
const ADD_TO_PLAYLIST = "myPlaylist/addSongToPlaylist";
const REMOVE_FROM_PLAYLIST = "myPlaylist/removeSongFromPlaylist";
const UNLOAD_PLAYLIST = "myPlaylist/deletePlaylist";
const LOAD_PLAYLIST = "myPlaylist/addPlaylist";

/* ACTIONS */

export const addSong = (playlistId, song) => ({
  type: ADD_TO_PLAYLIST,
  playlistId,
  song,
});

export const removeSong = (playlistId, songId) => ({
  type: REMOVE_FROM_PLAYLIST,
  playlistId,
  songId,
});

export const loadPlaylists = (playlists) => ({
  type: LOAD_PLAYLISTS,
  playlists,
});
export const loadPlaylist = (playlist) => ({
  type: LOAD_PLAYLIST,
  playlist,
});

export const unloadPlaylist = (playlistId) => ({
  type: UNLOAD_PLAYLIST,
  playlistId,
});

/* THUNKS */

export const fetchMyPlaylist = (playlistId) => async (dispatch) => {
  const res = await fetch(`/api/playlist/${playlistId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadPlaylist(data));
    return data;
  }

  return res.json();
};

export const putPlaylist = (playlist) => async (dispatch) => {
  const res = await put(`/api/playlists/${playlist.id}`, playlist);
  dispatch(loadPlaylist(res));
  if (res.isPublic) {
    dispatch(loadOne(res));
  }
  return res;
};

export const addSongToPlaylist = (song, playlist) => async (dispatch) => {
  const songId =
    typeof song == "number" || typeof song == "string" ? Number(song) : song.id;
  const playlistId =
    typeof playlist == "number" || typeof playlist == "string"
      ? Number(playlist)
      : playlist.id;

  const updatedPlaylist = await post(`/api/playlists/${playlistId}/song`, {
    song_id: songId,
  });
  if (typeof song == "object") {
    dispatch(addSong(playlistId, song));
    return song;
  }
  const songFound = updatedPlaylist.songs.find((song) => song.id == songId);
  dispatch(addSong(playlistId, songFound));
  return songFound;
};

export const removeSongFromPlaylist = (song, playlist) => async (dispatch) => {
  const songId =
    typeof song == "number" || typeof song == "string" ? Number(song) : song.id;
  const playlistId =
    typeof playlist == "number" || typeof playlist == "string"
      ? Number(playlist)
      : playlist.id;
  const res = await del(`/api/playlists/${playlistId}/songs/${songId}`);
  dispatch(removeSong(playlistId, songId));
  return res;
};

export const fetchMyPlaylists = () => async (dispatch) => {
  const playlists = await get("/api/playlists/current");
  const validPlaylists = playlists.filter(
    ({ name }) => !["Liked", "Library", "Queue"].includes(name)
  );
  dispatch(loadPlaylists(validPlaylists));
  return validPlaylists;
};

export const deletePlaylist = (playlistId) => async (dispatch) => {
  const deleted = await del(`/api/playlists/${playlistId}`);
  dispatch(unloadPlaylist(playlistId));
  return deleted;
};

export const addPlaylist = (playlistData) => async (dispatch) => {
  const res = await post("/api/playlists", playlistData);
  console.log("\n\n\n\nTHIS IS WHAT WE GET!!!!:", res, "\n\n\n");
  dispatch(loadPlaylist(res));
  return res;
};

/* SELECTORS */

export const selectMyPlaylists = (state) => state.myPlaylists;
export const selectMyPlaylistsArray = (state) =>
  state.myPlaylists.playlistArray;
export const selectMyPlaylistById = (playlistId) => (state) =>
  state.myPlaylists[playlistId];

/* INITIAL STATE */

const initialState = { playlistArray: [] };

/* REDUCER */

export default function myPlaylistsReducer(state = initialState, action) {
  const playlistId = action.playlistId;
  const playlistAtId = state[playlistId] || null;
  switch (action.type) {
    case LOAD_PLAYLISTS:
      return {
        ...state,
        playlistArray: action.playlists,
        ...action.playlists.reduce(
          (obj, playlist) => ({
            ...obj,
            [playlist.id]: playlist,
          }),
          {}
        ),
      };
    case LOAD_PLAYLIST: {
      return {
        ...state,
        playlistArray: [
          ...state.playlistArray.filter(({ id }) => id != action.playlist.id),
          action.playlist,
        ],
        [action.playlist.id]: action.playlist,
      };
    }
    case UNLOAD_PLAYLIST:
      return {
        ...state,
        playlistArray: state.playlistArray.filter(({ id }) => id != playlistId),
        [playlistId]: undefined,
      };
    case ADD_TO_PLAYLIST: {
      return {
        ...state,
        [playlistId]: {
          ...playlistAtId,
          songs: [...playlistAtId.songs, action.song],
        },
      };
    }
    case REMOVE_FROM_PLAYLIST:
      console.log(playlistAtId)
      return {
        ...state,
        [playlistId]: {
          ...playlistAtId,
          songs:
            playlistAtId?.songs?.filter(({ id }) => id != action.songId) || [],
        },
      };
    default:
      return state;
  }
}
