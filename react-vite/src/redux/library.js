import { post, del, get } from "./csrf";
import { createSelector } from "reselect";

/* ACTION TYPES */

const LOAD_PLAYLIST = "library/loadPlaylist";
const LOAD_SONG = "library/loadSong";
const DELETE_SONG = "library/deleteSong";

/* ACTIONS */

export const loadSong = (song) => ({
  type: LOAD_SONG,
  song,
});

export const removeSong = (songId) => ({
  type: DELETE_SONG,
  songId,
});

export const loadPlaylist = (playlist) => ({
  type: LOAD_PLAYLIST,
  playlist,
});

/* THUNKS */

export const addSong = (song) => async (dispatch, getState) => {
  const songId =
    typeof song == "number" || typeof song == "string" ? Number(song) : song.id;
  const state = getState();
  const playlistId = state.library.id;
  if (typeof playlistId != "number" && typeof playlistId != "string") {
    throw Error("Library Playlist is not initialized in store");
  }
  const updatedPlaylist = await post(`/api/playlists/${playlistId}/song`, {
    song_id: songId,
  });
  if (typeof song == "object") {
    dispatch(loadSong(song));
    return song;
  }
  return updatedPlaylist.songs.find(
    (song) => song.id == songId && dispatch(loadSong(song))
  );
};

export const removeSongFromLibrary = (song) => async (dispatch, getState) => {
  const songId =
    typeof song == "number" || typeof song == "string" ? Number(song) : song.id;
  const state = getState();
  const playlistId = state.library.id;
  if (typeof playlistId != "number" && typeof playlistId != "string") {
    throw Error("Library Playlist is not initialized in store");
  }
  const res = await del(`/api/playlists/${playlistId}/songs/${songId}`);
  dispatch(removeSong(songId));
  return res;
};

export const fetchLibrary = () => async (dispatch) => {
  const playlist = await get("/api/playlists/library");
  dispatch(loadPlaylist(playlist));
  return playlist;
};

/* SELECTORS */

export const selectLibrarySongs = (state) => state.library.songs;
export const selectLibrarySongsCount = (state) => state.library.length;
export const selectLibraryPlaylist = (state) => state.library;
export const selectIsAdded = createSelector(
  [selectLibrarySongs, (state, songId) => songId],
  (songs, songId) => !!songs.find(({ id }) => id == songId)
);

/* INITIAL STATE */

const initialState = {
  songs: [],
  name: "Library",
  isPublic: false,
  description: "My Library Songs",
};

/* REDUCER */

export default function libraryReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PLAYLIST:
      return {
        ...state,
        ...action.playlist,
      };
    case LOAD_SONG:
      return {
        ...state,
        songs: [
          ...state.songs.filter(({ id }) => id != action.song.id),
          action.song,
        ],
      };
    case DELETE_SONG:
      return {
        ...state,
        songs: state.songs.filter(({ id }) => id != action.songId),
      };
    default:
      return state;
  }
}
