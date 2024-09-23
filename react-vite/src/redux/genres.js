import { createSelector } from "reselect";
import { post, get } from "./csrf";

const LOAD_ALL = "genres/loadAll";
const LOAD_ONE = "genres/loadOne";

export const loadAll = (genres) => {
  return {
    type: LOAD_ALL,
    genres,
  };
};
export const loadOne = (genre) => {
  return {
    type: LOAD_ONE,
    genre,
  };
};

export const fetchGenres = () => async (dispatch) => {
  const res = await fetch("/api/genres");

  if (res.ok) {
    const data = await res.json();
    dispatch(loadAll(data));

    return data;
  }

  return res;
};

export const createGenre = (genre) => async (dispatch) => {
  const genre = await post("/genres", genre); //This will throw an error if there is an error
  dispatch(loadOne(genre));
  return genre;
};
export const fetchGenre = (genreId) => async (dispatch) => {
  const genre = await get("/genres/" + genreId); //This will throw an error if there is an error
  dispatch(loadOne(genre));
  return genre;
};

export const selectGenres = (state) => state.genres;
export const selectGenresArray = createSelector(selectGenres, (genres) => {
  return Object.values(genres);
});

export default function genresReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ALL: {
      const newState = {};

      action.genres.forEach((genre) => {
        newState[genre.id] = genre;
      });

      return {
        ...state,
        ...newState,
      };
    }
    case LOAD_ONE: {
      return {
        ...state,
        [action.genre.id]: {
          ...action.genre,
        },
      };
    }
    default:
      return state;
  }
}
