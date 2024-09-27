import { createSelector } from "reselect";
import { post, put, get } from "./csrf";

const LOAD_ALL = "playlists/loadAll";
const LOAD_ONE = "playlists/loadOne";
const LOAD_QUEUE = "playlists/loadQueue";
const LOAD_LIKED = "playlists/loadLiked";
const ADD_TO_QUEUE = "playlists/addToQueue";
const ADD_TO_LIKED = "playlists/addToLiked";
const REMOVE_FROM_LIKED = "playlists/removeFromLiked";
const PLAY_NEXT = "playlists/playNext";
const SET_CURRENT_SONG_INDEX = "playlists/setCurrentSongIndex";
const CLEAR_QUEUE = "playlists/clearQueue";

export const clearQueue = () => ({
  type: CLEAR_QUEUE,
});

export const loadAll = (playlists) => ({
  type: LOAD_ALL,
  playlists,
});

export const loadOne = (playlist) => ({
  type: LOAD_ONE,
  playlist,
});

export const loadQueue = (queue) => ({
  type: LOAD_QUEUE,
  queue,
});

export const addToQueue = (song) => ({
  type: ADD_TO_QUEUE,
  song,
});

export const loadLiked = (liked) => ({
  type: LOAD_LIKED,
  liked,
});

export const addToLiked = (song) => ({
  type: ADD_TO_LIKED,
  song,
});

export const removeFromLiked = (songId) => ({
  type: REMOVE_FROM_LIKED,
  songId,
});

export const playNext = () => ({
  type: PLAY_NEXT,
});

export const setCurrentSongIndex = (index) => ({
  type: SET_CURRENT_SONG_INDEX,
  index,
});

export const fetchPlaylists = () => async (dispatch) => {
  const res = await fetch("/api/playlists");

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));
    return data;
  }
  return res;
};

export const fetchPlaylist = (playlistId) => async (dispatch) => {
  const res = await fetch(`/api/playlists/${playlistId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadOne(data));
    return data;
  }
  return res;
};

export const putPlaylist = (playlist) => async (dispatch) => {
  const res = await put(`/api/playlists/${playlist.id}`, playlist);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadOne(data));
    return data;
  }
};

export const fetchLiked = () => async (dispatch) => {
  const res = await get("/api/playlists/liked");
  dispatch(loadLiked(res));
  return res;
};

export const unlike = (songId) => async (dispatch) => {
  const res = await fetch(`/api/playlists/liked/${songId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(removeFromLiked(songId));
    return data;
  }

  return res.json();
};

export const addLike = (playlistId, song) => async (dispatch) => {
  const res = await fetch(`/api/playlists/${playlistId}/song`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      song_id: song.id,
      playlist_id: playlistId,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addToLiked(song));
    return data;
  }

  return res;
};

export const editPlaylist = (playlistData) => async (dispatch) => {
  const { id, name, description, is_public, songs } = playlistData;

  try {
    const response = await fetch(`/api/playlists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        is_public,
        songs,  // Include the reordered songs array with song_id and song_index
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors || 'Failed to update playlist');
    }

    const updatedPlaylist = await response.json();

    dispatch({
      type: 'UPDATE_PLAYLIST',
      payload: updatedPlaylist,
    });

    return updatedPlaylist;
  } catch (error) {
    dispatch({
      type: 'UPDATE_PLAYLIST_ERROR',
      payload: error.message,
    });

    return { error: error.message };
  }
};


export const removeSongFromPlaylist = (playlistId, songId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to remove the song from the playlist");
    }

    dispatch({
      type: "REMOVE_SONG_FROM_PLAYLIST",
      payload: { playlistId, songId },
    });
  } catch (error) {
    console.error("Error removing song:", error);
  }
};

export const createPlaylists = (playlistData) => async (dispatch) => {
  const newPlaylist = await post("/playlists", playlistData);
  dispatch(loadOne(newPlaylist));
  return newPlaylist;
};

export const selectPlaylists = (state) => state.playlists;
export const selectPlaylistById = (playlistId) => (state) =>
  state.playlists[playlistId];
export const selectLiked = (state) => state.playlists.liked;
export const selectPlaylistsArray = createSelector(
  selectPlaylists,
  (playlists) => Object.values(playlists)
);

export default function playlistsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ALL: {
      const newState = { ...state };
      action.playlists.forEach((playlist) => {
        newState[playlist.id] = playlist;
      });
      return newState;
    }
    case LOAD_ONE: {
      return {
        ...state,
        [action.playlist.id]: action.playlist,
      };
    }
    case LOAD_LIKED:
      return {
        ...state,
        liked: Array.isArray(action.liked.songs) ? action.liked.songs : [],
      };
    case ADD_TO_LIKED:
      return {
        ...state,
        liked: [...state.liked, action.song],
      };
    case REMOVE_FROM_LIKED: {
      const updatedLiked = state.liked.filter(
        (song) => song.id !== action.songId
      );
      return {
        ...state,
        liked: updatedLiked,
      };
    }
    case "REMOVE_SONG_FROM_PLAYLIST":
      const { playlistId, songId } = action.payload;
      return {
        ...state,
        [playlistId]: {
          ...state[playlistId],
          songs: state[playlistId].songs.filter((song) => song.id !== songId),
        },
      };
    default:
      return state;
  }
}
