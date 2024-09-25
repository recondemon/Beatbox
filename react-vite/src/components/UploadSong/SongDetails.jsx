import { useState, useEffect } from 'react';
import { createSong } from '../../redux/songs';
import { useDispatch } from 'react-redux';

const SongDetails = ({ albumId }) => {
  const dispatch = useDispatch();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [songName, setSongName] = useState('');
  const [songFile, setSongFile] = useState(null);

  const handleSongNameChange = (e) => {
    setSongName(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSongFile(file);
  };

  const handleUploadSong = async () => {
    const hardcodedAlbumId = 1;
  
    if (songFile) {
      const songData = {
        name: songName,
        genre: selectedGenre || 'Rock',
        file: songFile,
        album_id: hardcodedAlbumId,
      };
  

      console.log("Uploading song with data: ", songData);
  
      await dispatch(createSong(songData));
    } else {
      console.error("No song file selected");
    }
  };
  

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/genres/');
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className='flex flex-col mt-4 p-4'>
      <div className='flex gap-2'>
        <input
          id='song-name'
          type='text'
          placeholder='Song Name'
          className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg'
          onChange={handleSongNameChange}
        />
        <select
          id='genre'
          className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg'
          onChange={handleGenreChange}
        >
          <option value=''>Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <input
          id='song-file'
          type='file'
          accept='audio/*'
          className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg mt-4'
          onChange={handleFileChange}
        />
      </div>
      <div className='flex justify-end'>
        <button
          className='bg-primary p-2 rounded-lg mt-4'
          onClick={handleUploadSong}
        >
          Upload Song
        </button>
      </div>
    </div>
  );
};

export default SongDetails;
