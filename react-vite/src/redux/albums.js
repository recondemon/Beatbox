import { createSelector } from 'reselect';
import { post } from './csrf';

const LOAD_ALL = 'albums/loadAll';
const LOAD_ONE = 'albums/loadOne';
const CREATE = 'albums/create';
const UPDATE = 'albums/update';
const DELETE = 'albums/delete';
const RESET_ALBUMS = 'albums/reset';

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

export const updateAlbum = updatedAlbum => {
  return {
    type: UPDATE,
    updatedAlbum,
  };
};

export const deleteAlbum = albumId => {
  return {
    type: DELETE,
    albumId,
  };
};

export const resetAlbums = () => {
  return {
    type: RESET_ALBUMS,
  };
};

export const editAlbum = (albumId, albumData) => async dispatch => {
  const res = await fetch(`/api/albums/${albumId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(albumData),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(updateAlbum(data));
    return data;
  }
  return res;
};

export const removeAlbum = albumId => async dispatch => {
  const res = await fetch(`/api/albums/${albumId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    dispatch(deleteAlbum(albumId));
    return true;
  }
  return false;
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

export const fetchAlbumsByUserId = userId => async dispatch => {
  dispatch(resetAlbums());

  const res = await fetch(`/api/albums/user/${userId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));
    return data;
  }

  return res;
};

export const createAlbum = album => async dispatch => {
  const data = await fetch('/api/albums', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: album,
  });
  dispatch(create(data));
  return data;
};

export const selectAlbumByUserId = userId => state => {
  return Object.values(state.albums).filter(album => album.userId === userId);
};
export const selectAlbums = state => state.albums;
export const selectAlbumById = albumId => state => state.albums[albumId];
export const selectAlbumsArray = createSelector(selectAlbums, albums => {
  return Object.values(albums);
});

export default function albumsReducer(state = {}, action) {
  switch (action.type) {
    case RESET_ALBUMS:
      return {};
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
    case UPDATE:
      return {
        ...state,
        [action.updatedAlbum.id]: {
          ...action.updatedAlbum,
        },
      };
    case DELETE: {
      const newState = { ...state };
      delete newState[action.albumId];
      return newState;
    }
    default:
      return state;
  }
}
