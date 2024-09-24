import { createSelector } from "reselect";
import { post } from "./csrf";

const LOAD_ALL = "playlists/loadAll";
const LOAD_ONE = "playlists/loadOne";
const LOAD_QUEUE = "playlists/loadQueue";
const ADD_TO_QUEUE = "playlists/addToQueue";
const PLAY_NEXT = "playlists/playNext";
const SET_CURRENT_SONG_INDEX = "playlists/setCurrentSongIndex";

export const loadAll = (playlists) => {
  return {
    type: LOAD_ALL,
    playlists,
  };
};

export const loadOne = (playlist) => {
  return {
    type: LOAD_ONE,
    playlist,
  };
};

export const loadQueue = (queue) => {
  return {
    type: LOAD_QUEUE,
    queue,
  };
};

export const addToQueue = (song) => {
  return {
    type: ADD_TO_QUEUE,
    song,
  };
};

export const playNext = () => {
  return {
    type: PLAY_NEXT,
  };
};

export const setCurrentSongIndex = (index) => {
  return {
    type: SET_CURRENT_SONG_INDEX,
    index,
  };
};

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

export const createPlaylists = (playlist) => async (dispatch) => {
  const playlist = await post("/playlists", playlist);
  dispatch(loadOne(playlist));
  return playlist;
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
        queue: Array.isArray(state.queue)
          ? [...state.queue, action.song]
          : [action.song],
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
    default:
      return state;
  }
}
