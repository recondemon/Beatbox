import { createSelector } from "reselect";
import { post, put } from "./csrf";

const LOAD_ALL = "playlists/loadAll";
const LOAD_ONE = "playlists/loadOne";
const LOAD_QUEUE = "playlists/loadQueue";
const ADD_TO_QUEUE = "playlists/addToQueue";
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
  console.log("PUTTING", playlist);
  const res = await put(`/api/playlists/${playlist.id}`, playlist);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadOne(data));
    return data;
  }
};

export const fetchQueue = () => async (dispatch) => {
  const res = await fetch(`/api/playlists/queue`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadQueue(data));
    return data;
  }
  return res;
};

export const postToQueue = (song) => async (dispatch) => {
  const res = await post(`/api/playlists/queue`, { songs: [song.id] });
  console.log("POSTING TO QUEUE");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadQueue(data));
    console.log("NEW QUEUE:", data);
    return data;
  }
  return res;
};

export const createPlaylists = (playlistData) => async (dispatch) => {
  const newPlaylist = await post("/playlists", playlistData);
  dispatch(loadOne(newPlaylist));
  return newPlaylist;
};

export const selectPlaylists = (state) => state.playlists;
export const selectPlaylistById = (playlistId) => (state) =>
  state.playlists[playlistId];
export const selectQueue = (state) => state.playlists.queue;
export const selectPlaylistsArray = createSelector(
  selectPlaylists,
  (playlists) => Object.values(playlists)
);

export default function playlistsReducer(state = { queue: [] }, action) {
  switch (action.type) {
    case LOAD_ALL: {
      const newState = {};
      action.playlists.forEach((playlist) => {
        newState[playlist.id] = playlist;
      });
      return {
        ...state,
        ...newState,
      };
    }
    case LOAD_ONE: {
      return {
        ...state,
        [action.playlist.id]: {
          ...action.playlist,
        },
      };
    }
    case LOAD_QUEUE: {
      return {
        ...state,
        queue: Array.isArray(action.queue) ? action.queue : [],
      };
    }
    case ADD_TO_QUEUE: {
      return {
        ...state,
        queue: [...state.queue, action.song],
      };
    }
    case PLAY_NEXT: {
      return {
        ...state,
        queue: state.queue.slice(1),
      };
    }
    case SET_CURRENT_SONG_INDEX: {
      return {
        ...state,
        currentSongIndex: action.index,
      };
    }
    case CLEAR_QUEUE: {
      return {
        ...state,
        queue: [],
      };
    }
    default:
      return state;
  }
}
