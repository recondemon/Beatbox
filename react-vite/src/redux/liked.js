import { post, del, get } from "./csrf";
import { createSelector } from "reselect";

/* ACTION TYPES */

const LOAD_PLAYLIST = "liked/loadPlaylist";
const LOAD_SONG = "liked/loadSong";
const DELETE_SONG = "liked/deleteSong";

/* ACTIONS */

export const loadSong = (song) => ({
  type: LOAD_SONG,
  song,
});

export const loadPlaylist = (playlist) => ({
  type: LOAD_PLAYLIST,
  playlist,
});

export const removeSong = (songId) => ({
  type: DELETE_SONG,
  songId,
});

/* THUNKS */

export const likeSong = (song) => async (dispatch, getState) => {
  const songId =
    typeof song == "number" || typeof song == "string" ? Number(song) : song.id;
  const state = getState();
  const playlistId = state.liked.id;
  if (typeof playlistId != "number" && typeof playlistId != "string") {
    throw Error("Liked Playlist is not initialized in store");
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
export const unLikeSong = (song) => async (dispatch, getState) => {
  const songId =
    typeof song == "number" || typeof song == "string" ? Number(song) : song.id;
  const state = getState();
  const playlistId = state.liked.id;
  if (typeof playlistId != "number" && typeof playlistId != "string") {
    throw Error("Liked Playlist is not initialized in store");
  }
  const res = await del(`/api/playlists/${playlistId}/songs/${songId}`);
  dispatch(removeSong(songId));
  return res;
};

export const fetchLikedPlaylist = () => async (dispatch) => {
  const playlist = await get("/api/playlists/liked");
  dispatch(loadPlaylist(playlist));
  return playlist;
};

/* SELECTORS */

export const selectLikedSongsCount = (state) => state.liked.length;
export const selectLikedPlaylist = (state) => state.liked;
export const selectLikedSongs = (state) => state.liked.songs;
export const selectIsLiked = createSelector(
  [selectLikedSongs, (state, songId) => songId],
  (songs, songId) => !!songs.find(({ id }) => id == songId)
);

/* INITIAL STATE */

const initialState = {
  songs: [],
  name: "Liked",
  isPublic: false,
  description: "My Liked Songs",
};

/* REDUCER */

export default function likedReducer(state = initialState, action) {
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
