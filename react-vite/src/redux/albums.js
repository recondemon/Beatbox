import { createSelector } from "reselect";
import { post } from "./csrf";

const LOAD_ALL = "albums/loadAll";
const LOAD_ONE = "albums/loadOne";

export const loadAll = (albums) => {
  return {
    type: LOAD_ALL,
    albums,
  };
};

export const loadOne = (album) => {
  return {
    type: LOAD_ONE,
    album,
  };
};

export const fetchAlbums = () => async (dispatch) => {
  const res = await fetch("/api/albums");

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));

    return data;
  }

  return res;
};

export const fetchAlbumById = (id) => async (dispatch) => {
  const res = await fetch(`/api/albums/${id}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadOne(data));

    return data;
  }

  return res;
};

export const createAlbum = (album) => async (dispatch) => {
  const formData = new FormData();

  formData.append('album_name', album.album_name);
  formData.append('description', album.description);
  formData.append('release_date', album.release_date);

  if (album.album_cover_file) {
    formData.append('album_cover', album.album_cover_file);
  } else if (album.album_cover_url) {
    formData.append('album_cover_url', album.album_cover_url);
  }

  const response = await post("/api/albums", formData);

  if (response.ok) {
    const data = await response.json();
    dispatch(loadOne(data));
    return data;
  } else {
    const errorMessages = await response.json();
    return errorMessages;
  }
};

export const selectAlbums = (state) => state.albums;
export const selectAlbumById = (albumId) => (state) => state.albums[albumId];
export const selectAlbumsArray = createSelector(selectAlbums, (albums) => {
  return Object.values(albums);
});

export default function albumsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ALL: {
      const newState = {};

      action.albums.forEach((album) => {
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
    default:
      return state;
  }
}
