import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editAlbum } from '../../redux/albums';

const ChangeAlbumCoverModal = ({ albumId, onClose }) => {
  const dispatch = useDispatch();
  const [albumCoverFile, setAlbumCoverFile] = useState(null);
  const [errors, setErrors] = useState(null);

  const handleFileChange = (e) => {
    setAlbumCoverFile(e.target.files[0]);
  };

  const handleUploadCover = async () => {
    if (!albumCoverFile) {
      setErrors('Please select a file.');
      return;
    }

    const formData = {
        file: albumCoverFile,
    }

    try {
        const result = await dispatch(editAlbum(albumId, formData));
        if (!result.errors) {
            onClose();
        } else {
            console.error('Error uploading album cover:', result.errors);
        }
    } catch (error) {
        console.error('Error uploading album cover:', error);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-card p-6 rounded-md w-1/3'>
        <h2 className='text-xl mb-4'>Change Album Cover</h2>

        {errors && <p className='text-red-500'>{errors}</p>}

        <input type='file' accept='image/*' onChange={handleFileChange} className='mb-4' />

        <div className='flex justify-end gap-4'>
          <button onClick={onClose} className='p-2 bg-muted rounded-md'>
            Cancel
          </button>
          <button onClick={handleUploadCover} className='p-2 bg-primary text-white rounded-md'>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeAlbumCoverModal;
