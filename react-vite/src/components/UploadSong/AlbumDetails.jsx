import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import AlbumInputs from './AlbumInputs';
import { fetchAlbumsByUserId } from '../../redux/albums';

const AlbumDetails = ({ setAlbumId, errors, setErrors }) => {
  const [album, setAlbum] = useState('');
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [albumName, setAlbumName] = useState('');
  const [albumCover, setAlbumCover] = useState('');
  const [albumArtist, setAlbumArtist] = useState('');
  const [albums, setAlbums] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchAlbums = async () => {
        const data = await dispatch(fetchAlbumsByUserId(user.id)); //
        setAlbums(data);
      };

      fetchAlbums();
    }
  }, [dispatch, user, refreshTrigger]);

  const handleAlbumChange = e => {
    const selectedValue = e.target.value;
    const selectedValueInt = parseInt(selectedValue, 10);

    if (selectedValue === 'create-album') {
      handleCreateAlbumOption();
    } else {
      setAlbum(selectedValueInt);

      const selectedAlbum = albums.find(album => album.id === selectedValueInt);

      if (selectedAlbum) {
        setAlbumId(selectedAlbum.id);
        setAlbumCover(selectedAlbum.albumCover);
        setAlbumName(selectedAlbum.name);
        setAlbumArtist(
          selectedAlbum.artist.band_name
            ? selectedAlbum.artist[0].band_name
            : selectedAlbum.artist[0].first_name + ' ' + selectedAlbum.artist[0].last_name,
        );
      } else {
        setAlbumCover('');
        setAlbumName('');
        setAlbumArtist('');
      }
    }
  };

  const handleCreateAlbumOption = () => {
    setCreatingAlbum(true);
    setAlbum('');
  };

  const handleBackToSelect = () => {
    setCreatingAlbum(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className='flex w-full border-b-2 border-border py-4'>
      {creatingAlbum ? (
        <div className='flex flex-col w-full'>
          <AlbumInputs
            handleBackToSelect={handleBackToSelect}
            setAlbumId={setAlbumId}
            errors={errors}
            setErrors={setErrors}
          />
        </div>
      ) : (
        <div className='flex w-full gap-4'>
          <div className='flex flex-col w-1/2 gap-4'>
            <select
              title='Album'
              id='album'
              value={album}
              onChange={handleAlbumChange}
              className='w-full bg-input p-2 h-10 rounded-lg'
            >
              <option value=''>Select Album</option>
              <option
                className='text-primary border-b-2 border-border pb-2'
                value='create-album'
              >
                Create Album
              </option>
              {albums.length > 0
                ? albums.map(album => (
                    <option
                      key={album.id}
                      value={album.id}
                    >
                      {album.name}
                    </option>
                  ))
                : null}
            </select>
            <div>
              <h1>Album Name:</h1>
              <h1 className='text-1vw'>{albumName}</h1>
            </div>
            <div>
              <h1>Artist:</h1>
              <h1 className='text-1vw'>{albumArtist}</h1>
            </div>
          </div>
          <div className='flex justify-center items-center border-2 border-border w-1/3 min-h-[10rem] rounded-lg mx-auto'>
            {album ? (
              <div className='flex justify-center h-auto w-full'>
                <img
                  src={albumCover}
                  className='h-full w-full object-cover'
                />
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
