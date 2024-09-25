import { post } from './csrf';

const LOAD_QUEUE = 'queue/loadQueue';
const ADD_TO_QUEUE = 'queue/addToQueue';
const CLEAR_QUEUE = 'queue/clearQueue';
const SET_CURRENT_SONG_INDEX = 'playlists/setCurrentSongIndex';

export const loadQueue = queue => ({
  type: LOAD_QUEUE,
  queue,
});

export const addSong = song => ({
  type: ADD_TO_QUEUE,
  song,
});

export const clearQueue = () => ({
  type: CLEAR_QUEUE,
});

export const setCurrentSongIndex = index => ({
  type: SET_CURRENT_SONG_INDEX,
  index,
});

export const fetchQueue = () => async dispatch => {
  const res = await fetch('/api/playlists/queue');

  if (res.ok) {
    const data = await res.json();
    dispatch(loadQueue(data));
    return data;
  }

  return res.json();
};

export const addToQueue = song => async dispatch => {
  const res = await fetch('/api/playlists/queue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ song: song.id }),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addSong(data.songs));
    return data;
  }

  return res.json();
};

export const selectCurrentSongIndex = state => state.queue.currentSongIndex || 0;
export const selectQueue = state => state.queue.songs;

export default function queueReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_QUEUE: {
      return {
        ...state,
        songs: Array.isArray(action.queue.songs) ? action.queue.songs : [],
        currentSongIndex: state.currentSongIndex ? state.currentSongIndex : 0,
      };
    }
    case ADD_TO_QUEUE:
      const currentSongs = state.queue?.songs || [];

      if (currentSongs.length + 1 > 10) {
        return {
          ...state,
          songs: [...currentSongs.slice(1), action.song],
        };
      }

      return {
        ...state,
        songs: [...currentSongs, action.song],
      };
    case SET_CURRENT_SONG_INDEX:
      return {
        ...state,
        currentSongIndex: action.index,
      };
    case CLEAR_QUEUE:
      return {
        ...state,
        songs: [],
        currentSongIndex: 0,
      };
    default:
      return state;
  }
}
