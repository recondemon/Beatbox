import { createSelector } from 'reselect';
import { post, put, get } from './csrf';

const LOAD_ALL = 'playlists/loadAll';
const LOAD_ONE = 'playlists/loadOne';
const PLAY_NEXT = 'playlists/playNext';
const REMOVE_SONG = 'playlists/removeSong';

export const loadAll = playlists => ({
  type: LOAD_ALL,
  playlists,
});

export const loadOne = playlist => ({
  type: LOAD_ONE,
  playlist,
});

export const playNext = () => ({
  type: PLAY_NEXT,
});

export const removeSong = (playlistId, songId) => ({
  type: REMOVE_SONG,
  playlistId,
  songId,
});

export const fetchPlaylists = () => async dispatch => {
  const res = await fetch('/api/playlists');

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));
    return data;
  }
  return res;
};

export const fetchPlaylist = playlistId => async dispatch => {
  const res = await fetch(`/api/playlists/${playlistId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadOne(data));
    return data;
  }
  return res;
};

export const putPlaylist = playlist => async dispatch => {
  const res = await put(`/api/playlists/${playlist.id}`, playlist);
  dispatch(loadOne(res));
  return res;
};

export const editPlaylist = playlistData => async dispatch => {
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
        songs,
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

export const removeSongFromPlaylist = (playlistId, songId) => async dispatch => {
  try {
    const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove the song from the playlist');
    }

    dispatch({
      type: 'REMOVE_SONG_FROM_PLAYLIST',
      payload: { playlistId, songId },
    });
  } catch (error) {
    console.error('Error removing song:', error);
  }
};

export const createPlaylists = playlistData => async dispatch => {
  const newPlaylist = await post('/playlists/create', playlistData);
  dispatch(loadOne(newPlaylist));
  return newPlaylist;
};

export const selectPlaylists = state => state.playlists;
export const selectPlaylistById = playlistId => state => state.playlists[playlistId];
export const selectPlaylistsArray = createSelector(selectPlaylists, playlists =>
  Object.values(playlists),
);

export default function playlistsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ALL: {
      const newState = { ...state };
      action.playlists.forEach(playlist => {
        newState[playlist.id] = playlist;
      });
      return newState;
    }
    case LOAD_ONE:
      return {
        ...state,
        [action.playlist.id]: { ...action.playlist },
      };
    case REMOVE_SONG:
      return {
        ...state,
        [action.playlistId]: {
          ...state[action.playlistId],
          songs: state[action.playlistId].songs.filter(song => song.id !== action.songId),
        },
      };
    default:
      return state;
  }
}
