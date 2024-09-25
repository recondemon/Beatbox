import { createSelector } from "reselect";
import { post, get } from "./csrf";

const LOAD_ALL = "songs/loadAll";
const LOAD_ONE = "songs/loadOne";
const UPDATE_SONG = "songs/update";
const DELETE_SONG = "songs/delete";

export const loadAll = (songs) => {
  return {
    type: LOAD_ALL,
    songs,
  };
};
export const loadOne = (song) => {
  return {
    type: LOAD_ONE,
    song,
  };
};

export const updateSong = (updatedSong) => {
  return {
    type: UPDATE_SONG,
    updatedSong,
  };
};

export const deleteSong = (songId) => {
  return {
    type: DELETE_SONG,
    songId,
  };
};

export const editSong = (songId, songData) => async (dispatch) => {
  const res = await fetch(`/api/songs/${songId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(songData),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(updateSong(data));
    return data;
  }
  return res;
};

export const removeSong = (songId) => async (dispatch) => {
  const res = await fetch(`/api/songs/${songId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteSong(songId));
    return true;
  }
  return false;
};

export const fetchSongs = () => async (dispatch) => {
  const res = await fetch("/api/songs");

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));

    return data;
  }

  return res;
};

export const createSong = (songData) => async (dispatch) => {
  const song = await post("/songs", songData);
  dispatch(loadOne(song));
  return song;
};

export const fetchSong = (songId) => async (dispatch) => {
  const song = await get("/songs/" + songId);
  dispatch(loadOne(song));
  return song;
};

export const selectSongs = (state) => state.songs;
export const selectSongsArray = createSelector(selectSongs, (songs) => {
  return Object.values(songs);
});

export default function songsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ALL: {
      const newState = {};

      action.songs.forEach((song) => {
        newState[song.id] = song;
      });

      return {
        ...state,
        ...newState,
      };
    }
    case LOAD_ONE: {
      return {
        ...state,
        [action.song.id]: {
          ...action.song,
        },
      };
    }
    case UPDATE_SONG: {
      return {
        ...state,
        [action.updatedSong.id]: {
          ...action.updatedSong,
        },
      };
    }
    case DELETE_SONG: {
      const newState = { ...state };
      delete newState[action.songId];
      return newState;
    }
    default:
      return state;
  }
}
