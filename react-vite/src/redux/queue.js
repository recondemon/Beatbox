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

  console.log("ADDING " + song.name + " TO QUEUE");

  if (res.ok) {
    dispatch(addSong(song));
    const data = await res.json();
    return data;
  }

  return res.json();
};

export const clearQueue = () => async (dispatch) => {
  console.log("\n\n CLEARING QUEUE \n\n");

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
  state = { currentSongIndex: 0, currentSong: null },
  action
) {
  switch (action.type) {
    case LOAD_QUEUE: {
      const songArray = Array.isArray(action.queue) ? action.queue : [];
      console.log("INSIDE REDUCER:", songArray);
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
      console.log("CLEARED", {
        songs: [],
        currentSongIndex: 0,
        currentSong: null,
      });
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

      return {
        ...state,
        songs: [...currentSongs, action.song],
        currentSong: [...currentSongs, action.song][state.currentSongIndex],
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
      console.log("PLAYING NEXT");
      if (state.currentSongIndex >= state.songs.length - 1) {
        console.log("NEXT IS DISABLED");
        return state;
      }
      if (state.currentSongIndex >= state.songs.length - 2) {
        console.log("NOW PLAYING LAST SONG");
        return {
          ...state,
          currentSongIndex: state.currentSongIndex + 1,
          currentSong: {
            ...state.songs[state.currentSongIndex + 1],
            isLast: true,
          },
        };
      }
      console.log("NOW PLAYING NEXT SONG");
      return {
        ...state,
        currentSongIndex: state.currentSongIndex + 1,
        currentSong: state.songs[state.currentSongIndex + 1],
      };
    case PLAY_PREV:
      console.log("PLAYING PREV");
      if (state.currentSongIndex == 0) {
        return state;
      }
      return {
        ...state,
        currentSongIndex: state.currentSongIndex - 1,
        currentSong: state.songs[state.currentSongIndex - 1],
      };
    case PLAY_RANDOM:
      const randNum = Math.floor(Math.random() * state?.songs?.length || 0);
      return {
        ...state,
        currentSongIndex: randNum,
        currentSong: state.songs[randNum],
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
