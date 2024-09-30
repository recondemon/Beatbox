import { useDispatch, useSelector } from 'react-redux';
import {
  editAlbum,
  fetchAlbumById,
  fetchAlbumsByUserId,
  removeAlbum,
  selectAlbumsByUserId,
} from '../../redux/albums';
import { editSong, removeSong } from '../../redux/songs';
import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Edit3, Trash2, Save, X } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ChangeAlbumCoverModal from './ChangeAlbumCoverModal';

const ManageSongs = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.albums.isLoading);
  const user = useSelector(state => state.session.user);
  const albums = useSelector(selectAlbumsByUserId(user.id));
  // const [albumsSongs, setAlbumsSongs] = useState({
  //   albums: [],
  //   songs: [],
  // });
  const [expandedAlbums, setExpandedAlbums] = useState({});
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [albumInputValues, setAlbumInputValues] = useState({});
  const [editingSongs, setEditingSongs] = useState({});
  const [songInputValues, setSongInputValues] = useState({});
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [isAlbumCoverModalOpen, setAlbumCoverModalOpen] = useState(false);
  const [albumToUpdate, setAlbumToUpdate] = useState(null);

  useEffect(() => {
    dispatch(fetchAlbumsByUserId(user.id));
  }, [dispatch, user]);

  // useEffect(() => {
  //   setAlbumsSongs({
  //     albums: albums || [],
  //     songs: user.songs || [],
  //   });
  // }, [dispatch, user]);

  if (isLoading) {
    return (
      <div className='flex w-3/5 min-h-4/5 justify-center items-center mx-auto mt-[20vh]'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl'>Manage Songs</h2>
          <h3 className='text-xl text-center'>No albums found</h3>
        </div>
      </div>
    );
  }

  // if (!albumsSongs.albums || albumsSongs.albums.length === 0) {
  //   return (
  //     <div className='flex w-3/5 min-h-4/5 justify-center items-center mx-auto mt-[20vh]'>
  //       <div className='flex flex-col gap-4'>
  //         <h2 className='text-2xl'>Manage Songs</h2>
  //         <h3 className='text-xl text-center'>No albums found</h3>
  //       </div>
  //     </div>
  //   );
  // }

  const handleOpenDeleteModal = (id, type) => {
    setDeleteTarget(id);
    setDeleteType(type);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    setDeleteType(null);
  };

  const handleConfirmDelete = () => {
    if (deleteType === 'album') {
      handleDeleteAlbum(deleteTarget);
    } else if (deleteType === 'song') {
      handleDeleteSong(deleteTarget);
    }
    handleCloseDeleteModal();
  };

  const handleEditToggle = album => {
    setEditingAlbum(album.id);
    setAlbumInputValues({
      ...albumInputValues,
      [album.id]: {
        name: album.name,
        releaseDate: new Date(album.releaseDate),
        description: album.description,
      },
    });
  };

  const handleSaveAlbum = albumId => {
    const originalAlbum = albums.find(album => album.id === albumId);
    const updatedData = {};

    if (albumInputValues[albumId]?.name && albumInputValues[albumId].name !== originalAlbum.name) {
      updatedData.name = albumInputValues[albumId].name;
    }

    if (
      albumInputValues[albumId]?.releaseDate &&
      albumInputValues[albumId]?.releaseDate !== originalAlbum.releaseDate
    ) {
      updatedData.releaseDate = albumInputValues[albumId].releaseDate;
    } else {
      updatedData.releaseDate = new Date(originalAlbum.releaseDate).toISOString().split('T')[0];
    }

    if (
      albumInputValues[albumId]?.description &&
      albumInputValues[albumId].description !== originalAlbum.description
    ) {
      updatedData.description = albumInputValues[albumId].description;
    }

    if (Object.keys(updatedData).length === 0) {
      return;
    }

    dispatch(editAlbum(albumId, updatedData))
      .then(updatedAlbum => {
        // setAlbumsSongs(prevState => ({
        //   ...prevState,
        //   albums: prevState.albums.map(album =>
        //     album.id === albumId ? { ...album, ...updatedData } : album,
        //   ),
        // }));
        setEditingAlbum(null);
      })
      .catch(error => {
        console.error('Error updating album:', error);
      });
  };

  const handleInputChange = (albumId, field, value) => {
    setAlbumInputValues({
      ...albumInputValues,
      [albumId]: {
        ...albumInputValues[albumId],
        [field]: value,
      },
    });
  };

  const handleDeleteAlbum = albumId => {
    dispatch(removeAlbum(albumId)).then(() => {
      // setAlbumsSongs(prevState => ({
      //   ...prevState,
      //   albums: prevState.albums.filter(album => album.id !== albumId),
      //   songs: prevState.songs.filter(song => song.album_id !== albumId),
      // }));
    });
  };

  const handleCloseEditing = albumId => {
    if (editingAlbum === albumId) {
      setEditingAlbum(null);
    }
  };

  const toggleAlbumExpand = albumId => {
    setExpandedAlbums(prevState => ({
      ...prevState,
      [albumId]: !prevState[albumId],
    }));
  };

  const handleEditToggleSongs = albumId => {
    setEditingSongs(prevState => ({
      ...prevState,
      [albumId]: !prevState[albumId],
    }));
    const albumSongs = albums.map(album => album.songs.filter(song => song.album_id === albumId));
    const songEdits = {};
    albumSongs.forEach(song => {
      songEdits[song.id] = { name: song.name };
    });
    setSongInputValues(songEdits);
  };

  const handleSongInputChange = (songId, field, value) => {
    setSongInputValues({
      ...songInputValues,
      [songId]: {
        ...songInputValues[songId],
        [field]: value,
      },
    });
  };

  const handleSaveSongs = albumId => {
    const albumSongs = albums.map(album =>
      album.songs.filter(song => song.album_id === albumId),
    )[0];

    albumSongs.forEach(song => {
      const updatedData = {};

      if (songInputValues[song.id]?.name && songInputValues[song.id].name !== song.name) {
        updatedData.name = songInputValues[song.id].name;
      }

      if (Object.keys(updatedData).length > 0) {
        dispatch(editSong(song.id, updatedData));
      }
    });

    setEditingSongs(prevState => ({
      ...prevState,
      [albumId]: false,
    }));

    dispatch(fetchAlbumById(albumId));
  };

  const handleDeleteSong = (songId, albumId) => {
    dispatch(removeSong(songId)).then(() => {
      // setAlbumsSongs(prevState => ({
      //   ...prevState,
      //   songs: prevState.songs.filter(song => song.id !== songId),
      // }));
    });
  };

  const handleCloseEditingSongs = albumId => {
    const originalSongs = albums.map(album =>
      album.songs.filter(song => song.album_id === albumId),
    );

    const resetSongValues = {};
    originalSongs.forEach(song => {
      resetSongValues[song.id] = { name: song.name };
    });

    setSongInputValues({
      ...songInputValues,
      [albumId]: resetSongValues,
    });

    setEditingSongs(prevEditingSongs => ({
      ...prevEditingSongs,
      [albumId]: false,
    }));
  };

  const handleChangeAlbumCover = albumId => {
    setAlbumToUpdate(albumId);
    setAlbumCoverModalOpen(true);
  };

  const handleCloseAlbumCoverModal = () => {
    setAlbumCoverModalOpen(false);
    setAlbumToUpdate(null);
  };

  return (
    <div className='flex flex-col mx-auto mt-6 w-4/5 py-6 items-center min-h-[70vh]'>
      <h2 className='text-2xl mb-3'>Manage Songs</h2>

      <div className='grid grid-cols-2 gap-4'>
        {albums.map(album => (
          <div
            key={album.id}
            className='bg-card rounded-md'
          >
            <div className='flex'>
              <div className='flex flex-col gap-4 p-4'>
                <div className='w-[10vw] h-auto'>
                  <img
                    src={album.albumCover}
                    alt='album cover'
                    className='w-full h-full object-cover'
                  />
                </div>

                <button
                  className='hover:bg-accent transition duration-200 border-2 border-border rounded-lg bg-muted p-2'
                  onClick={() => handleChangeAlbumCover(album.id)}
                >
                  Change album cover
                </button>
              </div>

              <div className='flex flex-col p-4 gap-2'>
                {editingAlbum === album.id ? (
                  <div className='flex flex-col gap-2'>
                    <input
                      type='text'
                      value={albumInputValues[album.id]?.name || ''}
                      onChange={e => handleInputChange(album.id, 'name', e.target.value)}
                      placeholder={album.name}
                      className='bg-input text-secondary-foreground p-2 w-full'
                    />

                    <input
                      type='date'
                      value={
                        new Date(albumInputValues[album.id].releaseDate).toISOString().split('T')[0]
                      }
                      onChange={e => handleInputChange(album.id, 'releaseDate', e.target.value)}
                      placeholder={new Date(album.releaseDate).toISOString().split('T')[0]}
                      className='bg-input text-secondary-foreground p-2 w-full'
                    />

                    <textarea
                      type='text'
                      value={albumInputValues[album.id]?.description || ''}
                      onChange={e => handleInputChange(album.id, 'description', e.target.value)}
                      className='bg-input text-secondary-foreground p-2 w-full'
                    />
                  </div>
                ) : (
                  <div className='flex flex-col gap-2'>
                    <p className='text-lg'>{album.name}</p>
                    <p className='text-lg'>{new Date(album.releaseDate).getFullYear()}</p>
                    <p className='text-lg'>{album.description}</p>
                  </div>
                )}
              </div>

              <div className='pr-2 pt-2'>
                {editingAlbum === album.id ? (
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleSaveAlbum(album.id)}
                      className='p-2 text-green-600 rounded-lg'
                    >
                      <Save />
                    </button>
                    <button
                      onClick={() => handleCloseEditing(album.id)}
                      className='p-2 text-red-500 rounded-lg'
                    >
                      <X />
                    </button>
                  </div>
                ) : (
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleEditToggle(album)}
                      className='p-2 text-yellow-500 rounded-lg hover:text-foreground'
                    >
                      <Edit3 />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(album.id, 'album')}
                      className='p-2 text-red-500 rounded-lg hover:text-foreground'
                    >
                      <Trash2 />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* need to add songs here */}
            <div className='mt-1 text-md p-4'>
              <div className='flex justify-between items-center'>
                <div className='flex gap-4'>
                  <p>Songs - {album.songs.length}</p>

                  <button onClick={() => toggleAlbumExpand(album.id)}>
                    {expandedAlbums[album.id] ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {editingSongs[album.id] ? (
                    <div>
                      <button
                        onClick={() => handleSaveSongs(album.id)}
                        className='p-2 text-green-600 rounded-lg'
                      >
                        <Save />
                      </button>

                      <button
                        onClick={() => handleCloseEditingSongs(album.id)}
                        className='p-2 text-red-500 rounded-lg'
                      >
                        <X />
                      </button>
                    </div>
                  ) : (
                    <div className='flex gap-4'>
                      <button onClick={() => handleEditToggleSongs(album.id)}>
                        <Edit3 className='ml-2 text-yellow-500' />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {expandedAlbums[album.id] && (
                <div>
                  {album.songs
                    .filter(song => song.album_id === album.id)
                    .map(song => (
                      <div
                        key={song.id}
                        className='flex items-center mt-2'
                      >
                        {editingSongs[album.id] ? (
                          <input
                            type='text'
                            value={songInputValues[song.id]?.name || song.name}
                            onChange={e => handleSongInputChange(song.id, 'name', e.target.value)}
                            className='bg-input text-secondary-foreground p-2 w-full'
                          />
                        ) : (
                          <p className='w-full'>{song.name}</p>
                        )}

                        {editingSongs[album.id] && (
                          <button
                            onClick={() => handleOpenDeleteModal(song.id, 'song')}
                            className='p-2 text-red-500'
                          >
                            <Trash2 />
                          </button>
                        )}
                      </div>
                    ))}

                  {editingSongs[album.id] && <div className='mt-2'></div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemType={deleteType}
      />

      {/* Change Album Cover Modal */}
      {isAlbumCoverModalOpen && (
        <ChangeAlbumCoverModal
          albumId={albumToUpdate}
          onClose={handleCloseAlbumCoverModal}
        />
      )}
    </div>
  );
};

export default ManageSongs;
