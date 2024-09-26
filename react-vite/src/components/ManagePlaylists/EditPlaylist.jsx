import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CircleMinus, Trash2, } from 'lucide-react';
import { fetchLiked, selectLiked, addLike, fetchPlaylists, unlike } from '../../redux/playlists';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtist } from '../../redux/artists';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { selectCurrentSong, addToQueue, clearQueue, setCurrentSongIndex } from '../../redux/queue';

const EditPlaylist = ({list}) => {
  list = {
    name: 'Liked',
    artist: [
      {
        band_name: 'Liked',
        first_name: 'Liked',
        last_name: 'Liked',
      },
    ],
    owner: [
      {
        band_name: 'Liked',
        first_name: 'Liked',
        last_name: 'Liked',
      },
    ],
    releaseDate: '2022-02-22T00:00:00.000Z',
    songs: [
      {
        id: 6,
        name: 'My Disaster',
        artist_id: 4,
        url: 'https://beatbox-songs.s3.us-east-2.amazonaws.com/Seether/Isolate+and+Medicate/My+Disaster.mp3',
      },
      {
        id: 3,
        name: 'In the End',
        artist_id: 3,
        url: 'https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/In+the+End.mp3',       
      },
      {
        id: 3,
        name: 'Sabotage',
        artist_id: 8,
        url: 'https://beatbox-songs.s3.us-east-2.amazonaws.com/Beastie+Boys/Sabotage.mp3',
      }

    ],
  }
  const dispatch = useDispatch();
  const [artists, setArtists] = useState({});
  const [songDurations, setSongDurations] = useState({});
  const artist = list?.artist
    ? list?.artist[0].band_name
      ? `${list?.artist[0].band_name}`
      : `${list?.artist[0].first_name} ${list?.artist[0].last_name}`
    : null;
  const owner = list?.owner
    ? list?.owner[0].band_name
      ? `${list?.owner[0].band_name}`
      : `${list?.owner[0].first_name} ${list?.owner[0].last_name}`
    : null;
  const releaseYear = new Date(list?.releaseDate).getFullYear() || null;
  const songCount = list?.songs?.length;
  const liked = useSelector(selectLiked);
  const likedIds = liked?.map(song => song.id) || [];
  const currentSong = useSelector(selectCurrentSong);
  const coverArt = list?.albumCover || '/playlist.jpeg';

  useEffect(() => {
    if (list?.songs) {
      const fetchArtists = async () => {
        const artistPromises = list?.songs?.map(async song =>
          dispatch(fetchArtist(song.artist_id)),
        );

        const artistData = await Promise.all(artistPromises);
        const artists = {};

        artistData.forEach(artist => {
          const artistName = artist.bandName
            ? artist.bandName
            : `${artist.firstName} ${artist.lastName}`;
          artists[artist.id] = artistName;
        });

        setArtists(artists);
      };

      fetchArtists();
    }
  }, [dispatch, list?.songs]);

  useEffect(() => {
    dispatch(fetchLiked());
    dispatch(fetchPlaylists());
  }, [dispatch]);

  // Updates duration and stores it for each song, including current song
  const handleLoadedMetadata = (songId, audioElement) => {
    // FIXME: Optional chaining cuz I was getting a random null error...should probably fix that...
    const duration = audioElement?.duration;

    setSongDurations(prevDurations => ({
      ...prevDurations,
      [songId]: duration,
    }));
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };



  if (!list) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className='mt-14 mx-44 overflow-x-clip max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-transparent'>
      <div className='mb-6 w-[80vw]'>
        <span className='flex gap-2 items-center'>
          <img
            className='max-w-56 max-h-56 rounded-md border border-accent'
            src={list?.name === 'Liked' ? '/liked.jpeg' : coverArt}
            alt='album artwork'
          />

          <div className='flex flex-col justify-center space-y-1'>
            {/* Edit Playlist Name */}
            <label 
              htmlFor='name'
            >
              Name
            </label>
            <input 
              id='name'
              title='name'
              type='text' 
              className='' 
              value={list?.name} 
              placeholder='Playlist Name'
              onChange={/* handleNameChange */ () => {}}
            />

            {/* Non-edit Playlist info */}
            <p className='text-sm'>
              {`${artist || owner} • `}
              {releaseYear && <>{` ${releaseYear} • `}</>} {songCount}
              {`${songCount === 1 ? ' song' : ' songs'}`}
            </p>

            {/* Edit Playlist Description */}
            <textarea 
              id='description'
              title='description'
              className='bg-input w-80 h-20 text-secondaryForeground rounded-lg'
              value={list?.description}
              placeholder='Description'
              onChange={/* handleDescriptionChange */ () => {}}
            />
          </div>
        </span>
      </div>
      <ul className='bg-card text-card-foreground w-full border border-border h-2/3 rounded-md'>
        {list?.songs?.length ? (
          list?.songs?.map((song, index) => (
            <li key={song.id} className='flex items-center py-4 hover:bg-muted'>
              <div className='flex gap-4 mx-4'>
                {/* Song number */}
                <div className=''>{index + 1}.</div>
                {/* Remove song from playlist */}
                <button
                  onClick={() => removeSongFromPlaylist(song.id)}
                  className='text-red-500 ml-2'
                >
                  <CircleMinus />
                </button>
                {/* Buttons to reorder songs */}
                <button 
                onClick={() => moveSongUp(index)} className='text-gray-500'
                >
                  <ChevronUp />
                </button>
                <button 
                onClick={() => moveSongDown(index)} className='text-gray-500'
                >
                  <ChevronDown />
                </button>
              </div>
              {/* Song content */}
              <div className='flex w-full mx-2 items-center justify-evenly cursor-pointer'>
                <audio
                  src={song.url}
                  onLoadedMetadata={e => handleLoadedMetadata(song.id, e.target)}
                  className='hidden'
                />

                <div className='flex-1'>
                  <h3
                    className={`font-semibold ${
                      currentSong?.id === song.id ? 'text-green-500' : ''
                    }`}
                  >
                    {song.name}
                  </h3>
                </div>

                <div className='flex-1 text-center'>
                  <p
                    className={`font-semibold ${
                      currentSong?.id === song.id ? 'text-green-500' : ''
                    }`}
                  >
                    {song.artist_id in artists && artists[song.artist_id]}
                  </p>
                </div>

                <div className='flex-1 text-right'>
                  <p
                    className={`font-semibold ${
                      currentSong?.id === song.id ? 'text-green-500' : ''
                    }`}
                  >
                    {songDurations[song.id] ? formatTime(songDurations[song.id]) : '--:--'}
                  </p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <h2 className='text-center text-2xl my-2'>No songs yet</h2>
        )}
      </ul>
    </div>
  );
}

export default EditPlaylist