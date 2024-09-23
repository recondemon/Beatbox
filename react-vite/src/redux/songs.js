import { createSelector } from "reselect";
import { post, get } from "./csrf";

const LOAD_ALL = "songs/loadAll";
const LOAD_ONE = "songs/loadOne";

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

export const fetchSongs = () => async (dispatch) => {
  const res = await fetch("/api/songs");

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));

    return data;
  }

  return res;
};

export const createSong = (song) => async (dispatch) => {
  const song = await post("/songs", song); //This will throw an error if there is an error
  dispatch(loadOne(song));
  return song;
};
export const fetchSong = (songId) => async (dispatch) => {
  const song = await get("/songs/" + songId); //This will throw an error if there is an error
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
    default:
      return state;
  }
}
