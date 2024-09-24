import { createSelector } from 'reselect';
import Cookies from 'js-cookie';
import { csrfFetch, post } from './csrf';

const LOAD_ALL = 'albums/loadAll';
const LOAD_ONE = 'albums/loadOne';
const CREATE = 'albums/create';

export const loadAll = albums => {
  return {
    type: LOAD_ALL,
    albums,
  };
};

export const loadOne = album => {
  return {
    type: LOAD_ONE,
    album,
  };
};

export const create = newAlbum => {
  return {
    type: CREATE,
    newAlbum,
  };
};

export const fetchAlbums = () => async dispatch => {
  const res = await fetch('/api/albums');

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));

    return data;
  }

  return res;
};

export const fetchAlbumById = id => async dispatch => {
  const res = await fetch(`/api/albums/${id}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadOne(data));

    return data;
  }

  return res;
};

export const fetchAlbumsByUserId = (userId) => async (dispatch) => {
  const res = await fetch(`/api/albums/user/${userId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));  // Load all albums for the user
    return data;
  }

  return res;
};


export const createAlbum = (album) => async (dispatch) => {
  const data = await post("/api/albums", album);
  dispatch(loadOne(data));
  return data;
};

export const selectAlbumByUserId = userId => state => {
  return Object.values(state.albums).filter(album => album.userId === userId);
}
export const selectAlbums = state => state.albums;
export const selectAlbumById = albumId => state => state.albums[albumId];
export const selectAlbumsArray = createSelector(selectAlbums, albums => {
  return Object.values(albums);
});

export default function albumsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ALL: {
      const newState = {};

      action.albums.forEach(album => {
        newState[album.id] = album;
      });

      return {
        ...state,
        ...newState,
      };
    }
    case LOAD_ONE:
      return {
        ...state,
        [action.album.id]: {
          ...action.album,
        },
      };
    case CREATE:
      return {
        ...state,
        [action.newAlbum.id]: {
          ...action.newAlbum,
        },
      };
    default:
      return state;
  }
}
