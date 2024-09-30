import { createSelector } from 'reselect';
import { post, get, put } from './csrf';
import { fetchAlbumsByUserId } from './albums';

const LOAD_ALL = 'songs/loadAll';
const LOAD_PAGINATED = 'songs/loadPaginated';
const LOAD_ONE = 'songs/loadOne';
const UPDATE_SONG = 'songs/update';
const DELETE_SONG = 'songs/delete';

export const loadAll = songs => {
  return {
    type: LOAD_ALL,
    songs,
  };
};
export const loadOne = song => {
  return {
    type: LOAD_ONE,
    song,
  };
};

export const loadPaginated = data => ({
  type: LOAD_PAGINATED,
  data,
});

export const updateSong = updatedSong => {
  return {
    type: UPDATE_SONG,
    updatedSong,
  };
};

export const deleteSong = songId => {
  return {
    type: DELETE_SONG,
    songId,
  };
};

export const editSong = (songId, songData) => async dispatch => {
  const res = await put(`/api/songs/${songId}`, songData);
  dispatch(updateSong(res));
  return res;
};

export const removeSong = songId => async dispatch => {
  const res = await fetch(`/api/songs/${songId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    dispatch(deleteSong(songId));
    return true;
  }
  return false;
};

export const fetchSongs =
  (page, limit = 10) =>
  async dispatch => {
    const res = await fetch(`/api/songs?page=${page}&limit=${limit}`);

    if (res.ok) {
      const data = await res.json();

      dispatch(
        loadPaginated({
          songs: data.songs,
          totalPages: data.total_pages,
          currentPage: data.current_page,
        }),
      );

      return data;
    }

    return res;
  };
export const fetchAllSongs = () => async dispatch => {
  const res = await fetch(`/api/songs/all`);

  if (res.ok) {
    const data = await res.json();

    dispatch(loadAll(data));

    return data;
  }

  return res;
};

export const createSong = songData => async dispatch => {
  const song = await post('/songs', songData);
  dispatch(loadOne(song));
  dispatch(fetchAlbumsByUserId(song.artist[0].id));
  return song;
};

export const fetchSong = songId => async dispatch => {
  const song = await get('/songs/' + songId);
  dispatch(loadOne(song));
  return song;
};

export const selectSongs = state => state.songs;
export const selectSongById = songId => state => state.songs[songId];
export const selectSongsArray = createSelector(selectSongs, songs => {
  return songs.paginated ? Object.values(songs.paginated) : [];
});
export const selectPagination = state => ({
  totalPages: state.songs.totalPages,
  currentPage: state.songs.currentPage,
});

export default function songsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_PAGINATED: {
      const newState = { ...state, paginated: {} };

      action.data.songs.forEach(song => {
        newState.paginated[song.id] = song;
      });

      newState.totalPages = action.data.totalPages;
      newState.currentPage = action.data.currentPage;

      return newState;
    }
    case LOAD_ALL: {
      action.songs;

      return {
        ...state,
        ...action.songs.reduce((obj, song) => ({ ...obj, [song.id]: song }), {}),
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
