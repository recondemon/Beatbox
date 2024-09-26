import { post, del, get } from "./csrf";

/* ACTION TYPES */

const LOAD_PLAYLISTS = "library/loadPlaylists";
const ADD_TO_PLAYLIST = "library/addSongToPlaylist";
const REMOVE_FROM_PLAYLIST = "library/removeSongFromPlaylist";

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

export const loadPlaylist = (playlists) => ({
  type: LOAD_PLAYLISTS,
  playlists,
});

/* THUNKS */

export const addSongToPlaylist = (song, playlist) => async (dispatch) => {
  const songId =
    typeof song == "integer" || typeof song == "string"
      ? Number(song)
      : song.id;
  const playlistId =
    typeof playlist == "integer" || typeof playlist == "string"
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
    typeof song == "integer" || typeof song == "string"
      ? Number(song)
      : song.id;
  const playlistId =
    typeof playlist == "integer" || typeof playlist == "string"
      ? Number(playlist)
      : playlist.id;
  const res = await del(`/api/playlists/${playlistId}/${songId}`);
  dispatch(removeSong(songId));
  return res;
};

export const fetchMyPlaylists = () => async (dispatch) => {
  const playlists = await get("/api/playlists/current");
  const validPlaylists = playlists.filter(
    ({ name }) => !["Liked", "Library", "Queue"].includes(name)
  );
  dispatch(loadPlaylist(validPlaylists));
  return validPlaylists;
};

/* SELECTORS */

export const selectMyPlaylists = (state) => state.myPlaylists;
export const selectMyPlaylistsArray = (state) =>
  state.myPlaylists.playlistArray;

/* INITIAL STATE */

const initialState = { playlistArray: [] };

/* REDUCER */

export default function myPlaylistsReducer(state = initialState, action) {
  const playlistId = state.playlistId;
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
