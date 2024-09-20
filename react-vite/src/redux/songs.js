import { createSelector } from "reselect";

const LOAD_ALL = 'songs/loadAll';

export const loadAll = songs => {
  return {
    type: LOAD_ALL,
    songs,
  };
};

export const fetchSongs = () => async dispatch => {
  const res = await fetch('/api/songs');

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));

    return data;
  }

  return res;
};

export const selectSongs = state => state.playlists;
export const selectSongsArray = createSelector(selectSongs, playlists => {
  return Object.values(playlists)
})

export default function songsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ALL: {
      const newState = {};

      action.songs.forEach(song => {
        newState[song.id] = song;
      });

      return {
        ...state,
        ...newState,
      };
    }
    default:
      return state;
  }
}
