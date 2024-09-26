import { useState, useEffect } from 'react';
import { createSong } from '../../redux/songs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenres, selectGenres } from '../../redux/genres';
import { CirclePlus } from 'lucide-react';

const SongDetails = ({ albumId }) => {
  const dispatch = useDispatch();
  const genres = useSelector(selectGenres) || [];
  const [songs, setSongs] = useState(
    [
        { name: '', genre: '', file: null, status: '', progress: 0 }
    ]
);

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
        console.log('Uploading songs:', songs);
        for(let i = 0; i < songs.length; i++){
            if(songs[i].file){
                const updatedSongs = [...songs];
                updatedSongs[i].status = 'uploading';
                setSongs(updatedSongs);

                const songData = {
                    name: songs[i].name,
                    genre: songs[i].genre,
                    file: songs[i].file,
                    album_id: albumId
                };
                
                try {
                    console.log('Uploading song data:', songData); 
                    await dispatch(createSong(songData));
                } catch (error) {
                console.error('Upload failed for song:', songs[i].name, error)
                updatedSongs[i].status = 'failed';
                }
                updatedSongs[i].status = 'successful uploaded';
                setSongs(updatedSongs);
            }
        }
    }

  return (
    <div className='flex flex-col mt-4 p-4 gap-4'>
        {songs.map((song, index) => (
        <div 
            className='flex flex-col gap-2'
            key={index}
        >
            <div className='flex gap-2'>
                <input
                    id={`song-name-${index}`}
                    type='text'
                    placeholder='Song Name'
                    className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg'
                    onChange={(e) => handleSongNameChange(index,e)}
                />
                <select
                    id={`genre-${index}`}
                    className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg'
                    value={song.genre}
                    onChange={(e) => handleGenreChange(index,e)}
                >
                    <option value=''>Select Genre</option>
                    {Object.values(genres).map((genre) => (
                    <option key={genre.id} value={genre.name}>
                        {genre.name}
                    </option>                
                    ))}
                </select>
            </div>
            <div>
                <input
                    id={`file-${index}`}
                    type='file'
                    accept='audio/*'
                    className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg mt-4'
                    onChange={(e) => handleFileChange(index,e)}
                />
            </div>

            {/* Status goes here */}
            <div>
                {song.status && (
                    <div>
                        {song.status}
                    </div>
                )}
                {song.status === 'uploading' && (
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-primary-light">
                            <div
                                style={{ width: `${song.progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                            >
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ))}
        <div className='flex gap-4 justify-end'>
            <button
                className='flex gap-2 p-2 items-center rounded-lg mt-4 hover:underline'
                onClick={handleAddAnotherSong}
            >
                <CirclePlus size={20}/> Add Another Song
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
