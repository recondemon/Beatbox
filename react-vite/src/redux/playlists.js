import { createSelector } from 'reselect';
import { post, put } from './csrf';

const LOAD_ALL = 'playlists/loadAll';
const LOAD_ONE = 'playlists/loadOne';
const LOAD_QUEUE = 'playlists/loadQueue';
const LOAD_LIKED = 'playlists/loadLiked';
const ADD_TO_QUEUE = 'playlists/addToQueue';
const ADD_TO_LIKED = 'playlists/addToLiked';
const PLAY_NEXT = 'playlists/playNext';
const SET_CURRENT_SONG_INDEX = 'playlists/setCurrentSongIndex';
const CLEAR_QUEUE = 'playlists/clearQueue';

export const clearQueue = () => ({
  type: CLEAR_QUEUE,
});

export const loadAll = playlists => ({
  type: LOAD_ALL,
  playlists,
});

export const loadOne = playlist => ({
  type: LOAD_ONE,
  playlist,
});

export const loadQueue = queue => ({
  type: LOAD_QUEUE,
  queue,
});

export const addToQueue = song => ({
  type: ADD_TO_QUEUE,
  song,
});

export const loadLiked = liked => ({
  type: LOAD_LIKED,
  liked,
});

export const addToLiked = song => ({
  type: ADD_TO_LIKED,
  song,
});

export const playNext = () => ({
  type: PLAY_NEXT,
});

export const setCurrentSongIndex = index => ({
  type: SET_CURRENT_SONG_INDEX,
  index,
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
  console.log('PUTTING', playlist);
  const res = await put(`/api/playlists/${playlist.id}`, playlist);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadOne(data));
    return data;
  }
};

export const fetchQueue = () => async dispatch => {
  const res = await fetch(`/api/playlists/queue`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadQueue(data));
    return data;
  }

  return res;
};

export const fetchLiked = () => async dispatch => {
  const res = await fetch('/api/playlists/liked');

  if (res.ok) {
    const data = await res.json();
    dispatch(loadLiked(data));
    return data;
  }

  return res;
};

export const postToQueue = song => async dispatch => {
  const res = await post(`/api/playlists/queue`, { songs: [song.id] });
  console.log('POSTING TO QUEUE');
  if (res.ok) {
    const data = await res.json();
    dispatch(loadQueue(data));
    console.log('NEW QUEUE:', data);
    return data;
  }
  return res;
};

export const addLike = (id, song) => async dispatch => {
  // NOTE: NOT CURRENTLY WORKING
  const res = await fetch(`/api/playlists/${id}/song`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      song_id: song.id,
      playlist_id: id,
    },
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addToLiked(data));
    return data;
  }

  return res;
};

export const createPlaylists = playlistData => async dispatch => {
  const newPlaylist = await post('/playlists', playlistData);
  dispatch(loadOne(newPlaylist));
  return newPlaylist;
};

export const selectCurrentSongIndex = state => state.playlists.currentSongIndex;
export const selectPlaylists = state => state.playlists;
export const selectPlaylistById = playlistId => state => state.playlists[playlistId];
export const selectQueue = state => state.playlists.queue;
export const selectLiked = state => state.playlists.liked;
export const selectPlaylistsArray = createSelector(selectPlaylists, playlists =>
  Object.values(playlists),
);

export default function playlistsReducer(state = { queue: [], currentSongIndex: 0 }, action) {
  switch (action.type) {
    case LOAD_QUEUE: {
      const persistedQueue = JSON.parse(localStorage.getItem('queue')) || action.queue;
      const persistedIndex = parseInt(localStorage.getItem('currentSongIndex'), 10) || 0;
      return {
        ...state,
        queue: persistedQueue,
        currentSongIndex: persistedIndex,
      };
    }
    case ADD_TO_QUEUE: {
      const newQueue = [...state.queue, action.song];
      localStorage.setItem('queue', JSON.stringify(newQueue));
      return {
        ...state,
        queue: newQueue,
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
    case PLAY_NEXT:
      const newQueue = state.queue.slice(1);
      localStorage.setItem('queue', JSON.stringify(newQueue));
      return {
        ...state,
        queue: newQueue,
      };
    case SET_CURRENT_SONG_INDEX:
      localStorage.setItem('currentSongIndex', action.index);
      return {
        ...state,
        currentSongIndex: action.index,
      };
    case CLEAR_QUEUE:
      localStorage.removeItem('queue');
      localStorage.removeItem('currentSongIndex');
      return {
        ...state,
        queue: [],
        currentSongIndex: 0,
      };
    default:
      return state;
  }
}
