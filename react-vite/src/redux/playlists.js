import { createSelector } from 'reselect';

const LOAD_ALL = 'playlists/loadAll';
const LOAD_ONE = 'playlists/loadOne';

export const loadAll = playlists => {
  return {
    type: LOAD_ALL,
    playlists,
  };
};

export const loadOne = playlist => {
  return {
    type: LOAD_ONE,
    playlist,
  };
};

export const fetchPlaylists = () => async dispatch => {
  const res = await fetch('/api/playlists');

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));

    return data;
  }

  return res;
};

export const selectPlaylists = state => state.playlists;
export const selectPlaylistById = playlistId => state => state.playlists[playlistId];
export const selectPlaylistsArray = createSelector(selectPlaylists, playlists => {
  return Object.values(playlists);
});

export default function playlistsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ALL: {
      const newState = {};

      action.playlists.forEach(playlist => {
        newState[playlist.id] = playlist;
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
