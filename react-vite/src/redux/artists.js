import { createSelector } from 'reselect';
import { post } from "./csrf";

const LOAD_ONE = 'artists/loadOne';

export const loadOne = artist => {
  return {
    type: LOAD_ONE,
    artist,
  };
};

export const fetchArtist = id => async dispatch => {
  const res = await fetch(`/api/artists/${id}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadOne(data));

    return data;
  }
  return res;
};

export const createArtist = (artist) => async (dispatch) => {
  const artist = await post("/artists", artist); //This will throw an error if there is an error
  dispatch(loadOne(artist));
  return artist;
};

export const selectArtists = state => state.artists;
export const selectArtistById = artistId => state => state.artists[artistId];
export const selectArtistsArray = createSelector(selectArtists, artists => {
  return Object.values(artists);
});

export default function artistsReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ONE: {
      return {
        ...state,
        [action.artist.id]: {
          ...action.artist,
        },
      };
    }
    default:
      return state;
  }
}
