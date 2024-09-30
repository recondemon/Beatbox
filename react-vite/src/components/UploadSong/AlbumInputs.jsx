import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { createAlbum } from '../../redux/albums';

const AlbumInputs = ({ handleBackToSelect, setAlbumId, errors, setErrors }) => {
  const dispatch = useDispatch();
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [albumCoverFile, setAlbumCoverFile] = useState(null);
  const [albumCoverUrl, setAlbumCoverUrl] = useState('');
  // const currUserId = useSelector((state) => state.session.user.id);

  const handleFileChange = e => {
    const file = e.target.files[0];
    setAlbumCoverFile(file);
    setAlbumCoverUrl('');
  };

  const handleUrlChange = e => {
    setAlbumCoverUrl(e.target.value);
    setAlbumCoverFile(null);
  };

  const handleCreateAlbum = async e => {
    if(!newAlbumName) {
      setErrors({ ...errors, name: 'Album name is required.' });
      return;
    }
    if(!releaseDate) {
      setErrors({ ...errors, release_date: 'Release date is required.' });
      return;
    }
    if(!albumCoverFile) {
      setErrors({ ...errors, file: 'Album cover is required.' });
      return;
    }
    e.preventDefault();

    const formData = {
      name: newAlbumName,
      description: newAlbumDescription,
      release_date: releaseDate,
      file: albumCoverFile,
    };
    // Result does not return an Id!! need to fix this

    try {
      const result = await dispatch(createAlbum(formData));
      if (!result.errors) {
        setAlbumId(result.id);
        handleBackToSelect();
      } else {
        console.error('Error creating album:', result.errors);
      }
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  return (
    <div className='flex flex-col border-2 border-border rounded-lg w-4/5'>
      <div className='flex justify-between p-2'>
        <button
          onClick={handleBackToSelect}
          className='p-2'
        >
          <ArrowLeft />
        </button>
        <button
          onClick={handleCreateAlbum}
          className='bg-primary p-2 rounded-lg'
        >
          Create Album
        </button>
      </div>
      <div className='p-4'>
        {errors.name && <p className='text-destructive'>{errors.name}</p>}
      </div>
      <div className='flex flex-col w-full p-4 gap-2'>
        <div className='flex flex-col w-full gap-4'>
          <div className='flex gap-2'>
            <div>
              <label htmlFor='album-name'>Album Name:</label>
              <input
                type='text'
                value={newAlbumName}
                onChange={e => setNewAlbumName(e.target.value)}
                placeholder='Enter album name'
                className='bg-input text-secondary-foreground p-2 w-full mt-2'
              />
            </div>
            <div>
              <label htmlFor='release-date'>Release Date:</label>
              <input
                type='date'
                id='release-date'
                value={releaseDate}
                onChange={e => setReleaseDate(e.target.value)}
                className='bg-input text-secondary-foreground p-2 w-full mt-2'
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor='album-description'>Album Description:</label>
          <textarea
            value={newAlbumDescription}
            onChange={e => setNewAlbumDescription(e.target.value)}
            placeholder='Enter album description'
            className='bg-input text-secondary-foreground p-2 mt-2 w-full'
          />
        </div>
      </div>
      <div className='flex flex-col p-4 gap-4'>
        <div className='flex flex-col'>
          <label htmlFor='album-cover-file'>Upload Album Cover:</label>
          <input
            type='file'
            id='album-cover-file'
            accept='image/*'
            onChange={handleFileChange}
            className='mt-2'
          />
        </div>
        {/* <div className='flex flex-col'>
          <label htmlFor='album-cover-url'>Or Enter Album Cover URL:</label>
          <input
            type='text'
            id='album-cover-url'
            value={albumCoverUrl}
            onChange={handleUrlChange}
            placeholder='Enter album cover URL'
            className='bg-input text-secondary-foreground p-2 mt-2 w-full'
          />
        </div> */}
        <div className='flex pr-4 py-2 mb-2 justify-center items-center border'>
          {albumCoverFile && (
            <img
              src={URL.createObjectURL(albumCoverFile)}
              alt='Album cover preview'
              className='w-32 h-32 object-cover'
            />
          )}
          {albumCoverUrl && (
            <img
              src={albumCoverUrl}
              alt='Album cover preview'
              className='w-32 h-32 object-cover'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumInputs;
