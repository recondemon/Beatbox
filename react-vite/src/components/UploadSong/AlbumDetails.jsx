import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import AlbumInputs from './AlbumInputs';
import { fetchAlbumById, selectAlbumsArray } from '../../redux/albums';

const AlbumDetails = () => {
  const [album, setAlbum] = useState('');
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const dispatch = useDispatch();
  const userAlbums = useSelector(selectAlbumsArray);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (user) {
      console.log(`User ID: ${user.id}`);
    }
    dispatch(fetchAlbumById(user.id));
  }, [dispatch, user]);

  const handleCreateAlbumOption = () => {
    setCreatingAlbum(true);
    setAlbum('');
  };

  const handleAlbumChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'create-album') {
      handleCreateAlbumOption();
    } else {
      setAlbum(selectedValue);
    }
  };

  const handleBackToSelect = () => {
    setCreatingAlbum(false);
  };

  return (
    <div className='flex w-full border-b-2 border-border py-4'>
      {creatingAlbum ? (
        <div className='flex flex-col w-full'>
          <AlbumInputs handleBackToSelect={handleBackToSelect} />
        </div>
      ) : (
        <div className='flex w-full gap-4'>
          <select
            title='Album'
            id='album'
            value={album}
            onChange={handleAlbumChange}
            className='w-1/2 bg-input p-2 h-10 rounded-lg'
          >
            <option value=''>Select Album</option>
            <option className='text-primary border-b-2 border-border pb-2' value='create-album'>Create Album</option>
            {userAlbums.length > 0 ? (
              userAlbums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.name}
                </option>
              ))
            ) : null}
          </select>
          <div className='flex justify-center items-center border-2 border-border p-4 w-1/2 min-h-[10rem]'>
            {album ? (
              <div>
                <h2>{album.name}</h2>
                <p>{album.description}</p>
              </div>
            ) : (
              <h2>No Album Selected</h2>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetails;
