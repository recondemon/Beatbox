import { post, del, get } from "./csrf";

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
  return updatedPlaylist.songs.find(
    (song) => song.id == songId && dispatch(addSong(playlistId, song))
  );
};

export const removeSongFromPlaylist = (song, playlist) => async (dispatch) => {
  const songId =
    typeof song == "number" || typeof song == "string" ? Number(song) : song.id;
  const playlistId =
    typeof playlist == "number" || typeof playlist == "string"
      ? Number(playlist)
      : playlist.id;
  const res = await del(`/api/playlists/${playlistId}/songs/${songId}`);
  dispatch(removeSong(songId));
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
  const data = await post(`/api/playlists`, playlistData);
  dispatch(loadPlaylist(data));
  return data;
};

/* SELECTORS */

export const selectMyPlaylists = (state) => state.myPlaylists;
export const selectMyPlaylistsArray = (state) =>
  state.myPlaylists.playlistArray;

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
          (obj, playlist, index) => ({ ...obj, [index]: playlist }),
          {}
        ),
      };
    case LOAD_PLAYLIST:
      return {
        ...state,
        playlistArray: [...state.playlistArray, action.playlist],
        [action.playlist.id]: action.playlist,
      };
    case UNLOAD_PLAYLIST:
      return {
        ...state,
        playlistArray: state.playlistArray.filter(({ id }) => id != playlistId),
        [playlistId]: undefined,
      };
    case ADD_TO_PLAYLIST:
      return {
        ...state,
        [playlistId]: {
          ...playlistAtId,
          songs: [...playlistAtId.songs, action.song],
        },
      };
    case REMOVE_FROM_PLAYLIST:
      return {
        ...state,
        [playlistId]: {
          ...playlistAtId,
          songs: playlistAtId.songs.filter(({ id }) => id != action.songId),
        },
      };
    default:
      return state;
  }
}
