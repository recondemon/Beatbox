const LOAD_QUEUE = "queue/loadQueue";
const ADD_TO_QUEUE = "queue/addToQueue";
const CLEAR = "queue/clearQueue";
const SET_CURRENT_SONG_INDEX = "queue/setCurrentSongIndex";
const PLAY_NEXT = "queue/playNext";
const PLAY_PREV = "queue/playPrev";
const PLAY_RANDOM = "queue/playRand";
const LOOP = "queue/loop";
const REV_LOOP = "queue/reverseLoop";

export const loadQueue = (queue) => ({
  type: LOAD_QUEUE,
  queue,
});

export const addSong = (song) => ({
  type: ADD_TO_QUEUE,
  song,
});

export const playNext = () => ({
  type: PLAY_NEXT,
});

export const playPrev = () => ({
  type: PLAY_PREV,
});
export const loop = () => ({
  type: LOOP,
});
export const reverseLoop = () => ({
  type: REV_LOOP,
});
export const playRandom = () => ({
  type: PLAY_RANDOM,
});

export const clear = () => ({
  type: CLEAR,
});

export const setCurrentSongIndex = (index) => ({
  type: SET_CURRENT_SONG_INDEX,
  index,
});

export const fetchQueue = () => async (dispatch) => {
  const res = await fetch("/api/playlists/queue");

  if (res.ok) {
    const data = await res.json();
    dispatch(loadQueue(data.songs));
    return data;
  }

  return res.json();
};

export const addToQueue = (song) => async (dispatch) => {
  const res = await fetch("/api/playlists/queue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ song: song.id }),
  });

  if (res.ok) {
    dispatch(addSong(song));
    const data = await res.json();
    return data;
  }

  return res.json();
};

export const addAllToQueue = (songs) => async (dispatch) => {
  for (const song of songs){
    await dispatch(addToQueue(song))
  }
};

export const clearQueue = () => async (dispatch) => {
  const res = await fetch("/api/playlists/queue", {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(clear());
    const data = await res.json();
    return data;
  }

  return res.json();
};

export const selectCurrentSongIndex = (state) =>
  state.queue.currentSongIndex || 0;
export const selectQueue = (state) => state.queue.songs;
export const selectCurrentSong = (state) => state.queue.currentSong;

export default function queueReducer(
  state = { currentSongIndex: 0, songs: [], currentSong: null },
  action
) {
  const isFirst =
    action.type == PLAY_PREV
      ? state.currentSongIndex - 1 == 0
      : action.index === 0;
  const isLast =
    action.type == PLAY_NEXT
      ? state.currentSongIndex + 2 == state.songs.length
      : action.index == state.songs.length - 1;
  switch (action.type) {
    case LOAD_QUEUE: {
      const songArray = Array.isArray(action.queue) ? action.queue : [];
      return {
        songs: songArray,
        currentSongIndex: 0,
        currentSong: {
          ...songArray[0],
          isFirst: true,
          isLast: songArray.length == 1,
        },
      };
    }
    case CLEAR:
      return {
        songs: [],
        currentSongIndex: 0,
        currentSong: null,
      };
    case ADD_TO_QUEUE:
      const currentSongs = state.songs || [];

      // if (currentSongs.length + 1 > 10) {
      //   if (state.currentSongIndex == 0) {
      //     return state;
      //   }
      //   return {
      //     ...state,
      //     songs: [...currentSongs.slice(1), action.song],
      //     currentSongIndex: state.currentSongIndex - 1,
      //     currentSong: [...currentSongs.slice(1), action.song][
      //       state.currentSongIndex - 1
      //     ],
      //   };
      // }

      if (state.currentSong === null || state.songs.length == 0) {
        return {
          ...state,
          songs: [...currentSongs, action.song],
          currentSong: {
            ...[...currentSongs, action.song][state.currentSongIndex],
            isFirst: true,
            isLast: true,
          },
        };
      }

      return {
        ...state,
        songs: [...currentSongs, action.song],
        currentSong: { ...state.currentSong, isLast: false },
      };
    case SET_CURRENT_SONG_INDEX:
      return {
        ...state,
        currentSongIndex: action.index,
        currentSong: {
          ...state.songs[action.index],
          isFirst: action.index == 0,
          isLast: action.index == state.songs.length - 1,
        },
      };
    case PLAY_NEXT:
      if (state.currentSongIndex >= state.songs.length - 1) {
        return state;
      }
      if (state.currentSongIndex >= state.songs.length - 2) {
        return {
          ...state,
          currentSongIndex: state.currentSongIndex + 1,
          currentSong: {
            ...state.songs[state.currentSongIndex + 1],
            isLast: true,
          },
        };
      }
      return {
        ...state,
        currentSongIndex: state.currentSongIndex + 1,
        currentSong: {
          ...state.songs[state.currentSongIndex + 1],
          isFirst,
          isLast: state.currentSongIndex + 1 == state.songs.length - 1,
        },
      };
    case PLAY_PREV:
      if (state.currentSongIndex == 0) {
        return state;
      }
      return {
        ...state,
        currentSongIndex: state.currentSongIndex - 1,
        currentSong: {
          ...state.songs[state.currentSongIndex - 1],
          isFirst,
          isLast,
        },
      };
    case PLAY_RANDOM:
      const randNum = Math.floor(Math.random() * state?.songs?.length || 0);
      return {
        ...state,
        currentSongIndex: randNum,
        currentSong: {
          ...state.songs[randNum],
          isFirst: randNum == 0,
          isLast: randNum + 1 == state.songs.length,
        },
      };
    case LOOP:
      return {
        ...state,
        currentSongIndex: 0,
        currentSong: {
          ...state.songs[0],
          isFirst: true,
          isLast: state.songs.length == 1,
        },
      };
    case REV_LOOP:
      return {
        ...state,
        currentSongIndex: state.songs.length - 1,
        currentSong: {
          ...state.songs[state.songs.length - 1],
          isFirst: state.songs.length == 1,
          isLast: true,
        },
      };
    default:
      return state;
  }
}
