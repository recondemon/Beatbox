import { useState, useEffect } from 'react';
import { createSong } from '../../redux/songs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenres, selectGenres } from '../../redux/genres';
import { CirclePlus } from 'lucide-react';

const SongDetails = ({ albumId, onClose, errors, setErrors }) => {
  const dispatch = useDispatch();
  const genres = useSelector(selectGenres) || [];
  const [songs, setSongs] = useState([
    { name: '', genre: '', file: null, status: '', progress: 0 },
  ]);


  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  const handleSongNameChange = (index, e) => {
    const updatedSongs = [...songs];
    updatedSongs[index].name = e.target.value;
    setSongs(updatedSongs);
  };

  const handleGenreChange = (index, e) => {
    const updatedSongs = [...songs];
    updatedSongs[index].genre = e.target.value;
    setSongs(updatedSongs);
  };

  const handleFileChange = (index, e) => {
    const updatedSongs = [...songs];
    updatedSongs[index].file = e.target.files[0];
    setSongs(updatedSongs);
  };

  const handleAddAnotherSong = () => {
    setSongs([...songs, { name: '', genre: '', file: null, status: '', progress: 0 }]);
  };

  const handleUploadSong = async () => {
    if (!albumId) {
      setErrors({ ...errors, album: 'Please select or create an album for this song.' });
      return;
    }

    let uploadSuccess = true;

    for (let i = 0; i < songs.length; i++) {
      if (!songs[i].name) {
        setErrors({ name: 'Song name is required.' });
        uploadSuccess = false;
        continue;
      } else if (!songs[i].genre) {
        setErrors({ genre: 'Please select a genre.' });
        uploadSuccess = false;
        continue;
      } else if (songs[i].file && songs[i].file.name.endsWith('.mp3')) {
        const updatedSongs = [...songs];
        updatedSongs[i].status = 'Uploading...';
        setSongs(updatedSongs);

        const songData = {
          name: songs[i].name,
          genre: songs[i].genre,
          file: songs[i].file,
          album_id: albumId,
        };

        try {
          await dispatch(createSong(songData));
        } catch (error) {
          console.error('Upload failed for song:', songs[i].name, error);
          updatedSongs[i].status = 'failed';
          setErrors({ ...errors, error });
        }
        updatedSongs[i].status = 'Upload complete.';
        setSongs(updatedSongs);
      } else if (!songs[i].file) {
        setErrors({ ...errors, file: 'No file selected.' });
        uploadSuccess = false;
      } else {
        setErrors({ ...errors, file: 'File must be of type MP4.' });
        uploadSuccess = false;
      }
    }

    if (uploadSuccess) {
      onClose();
    }
  };

  return (
    <div className='flex flex-col mt-4 p-4 gap-4'>
      {songs.map((song, index) => (
        <div
          className='flex flex-col gap-2'
          key={index}
        >
          {errors.name && <p className='text-destructive'>{errors.name}</p>}
          {errors.genre && <p className='text-destructive'>{errors.genre}</p>}
          <div className='flex gap-2'>
            <input
              id={`song-name-${index}`}
              type='text'
              placeholder='Song Name'
              className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg'
              onChange={e => handleSongNameChange(index, e)}
              required
            />

            <select
              id={`genre-${index}`}
              className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg'
              value={song.genre}
              onChange={e => handleGenreChange(index, e)}
            >
              <option value=''>Select Genre</option>
              {Object.values(genres).map(genre => (
                <option
                  key={genre.id}
                  value={genre.name}
                >
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              id={`file-${index}`}
              type='file'
              accept='audio/mp3'
              className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg mt-4'
              onChange={e => handleFileChange(index, e)}
              required
            />

            {errors.file && <p className='text-destructive mt-4'>{errors.file}</p>}
          </div>

          {/* Status goes here */}
          <div>
            {song.status && <div className='text-green-500'>{song.status}</div>}

            {song.status === 'uploading' && (
              <div className='relative pt-1'>
                <div className='overflow-hidden h-2 text-xs flex rounded bg-primary-light'>
                  <div
                    style={{ width: `${song.progress}%` }}
                    className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary'
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {errors.album && <p className='text-destructive'>{errors.album}</p>}

      <div className='flex gap-4 justify-end'>
        <button
          className='flex gap-2 p-2 items-center rounded-lg mt-4 hover:underline'
          onClick={handleAddAnotherSong}
        >
          <CirclePlus size={20} /> Add Another Song
        </button>
        <button
          className='bg-primary p-2 rounded-lg mt-4'
          onClick={handleUploadSong}
        >
          Upload Song/s
        </button>
      </div>
    </div>
  );
};

export default SongDetails;
