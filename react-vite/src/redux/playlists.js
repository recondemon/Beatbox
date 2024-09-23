import { createSelector } from "reselect";
import { post } from "./csrf";

const LOAD_ALL = "playlists/loadAll";
const LOAD_ONE = "playlists/loadOne";
const LOAD_QUEUE = "playlists/loadQueue";

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
export const loadQueue = (playlist) => {
  return {
    type: LOAD_QUEUE,
    playlist,
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

export const createPlaylists = (playlist) => async (dispatch) => {
  const playlist = await post("/playlists", playlist); //This will throw an error if there is an error
  dispatch(loadOne(playlist));
  return playlist;
};

export const selectPlaylists = (state) => state.playlists;
export const selectPlaylistById = (playlistId) => (state) =>
  state.playlists[playlistId];
export const selectQueue = (state) => state.playlists.Queue;
export const selectPlaylistsArray = createSelector(
  selectPlaylists,
  (playlists) => {
    return Object.values(playlists);
  }
);

export default function playlistsReducer(state = {}, action) {
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
    case LOAD_ONE: {
      return {
        ...state,
        Queue: {
          ...action.playlist,
        },
      };
    }
    default:
      return state;
  }
}
