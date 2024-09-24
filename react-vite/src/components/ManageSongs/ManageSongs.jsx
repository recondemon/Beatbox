import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbumsByUserId, editAlbum, removeAlbum, selectAlbumsArray } from '../../redux/albums';
import { editSong, removeSong } from '../../redux/songs';
import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Edit3, Trash2, Save } from 'lucide-react'; // Import Save icon

const ManageSongs = () => {
  const dispatch = useDispatch();
  const albums = useSelector(selectAlbumsArray);
  const user = useSelector((state) => state.session.user);

  const [expandedAlbums, setExpandedAlbums] = useState({});
  const [editingAlbum, setEditingAlbum] = useState({});
  const [editingSong, setEditingSong] = useState({});
  const [albumName, setAlbumName] = useState({});
  const [songName, setSongName] = useState({});

  useEffect(() => {
    if (user) {
      dispatch(fetchAlbumsByUserId(user.id)); 
    }
  }, [dispatch, user]);

  if (!albums || albums.length === 0) {
    return <div>Loading albums...</div>; 
  }

  const toggleAlbumVisibility = (albumId) => {
    setExpandedAlbums((prevState) => ({
      ...prevState,
      [albumId]: !prevState[albumId],
    }));
  };

  const handleEditAlbum = (albumId, album) => {
    setEditingAlbum((prevState) => ({
      ...prevState,
      [albumId]: !prevState[albumId],
    }));
    setAlbumName({ ...albumName, [albumId]: album.name });
  };

  const handleSaveAlbum = (albumId) => {
    dispatch(editAlbum(albumId, { name: albumName[albumId] }));
    setEditingAlbum((prevState) => ({
      ...prevState,
      [albumId]: false,
    }));
  };

  const handleEditSong = (songId, song) => {
    setEditingSong((prevState) => ({
      ...prevState,
      [songId]: !prevState[songId],
    }));
    setSongName({ ...songName, [songId]: song.name });
  };

  const handleSaveSong = (songId) => {
    dispatch(editSong(songId, { name: songName[songId] }));
    setEditingSong((prevState) => ({
      ...prevState,
      [songId]: false,
    }));
  };

  const handleDeleteAlbum = (albumId) => {
    dispatch(removeAlbum(albumId));
  };

  const handleDeleteSong = (songId) => {
    dispatch(removeSong(songId));
  };

  return (
    <div className="flex flex-col mx-auto mt-6 w-3/5 py-6 items-center border-2 border-border rounded-lg min-h-[70vh] bg-card">
      <h1 className='text-2vw'>Manage Songs</h1>
      {albums.map((album) => (
        <div key={album.id} className="flex flex-col w-full max-w-md p-4 border-b mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={album.albumCover} alt={album.name} className="w-12 h-12 mr-4" />

              {editingAlbum[album.id] ? (
                <>
                  <input 
                    type="text" 
                    value={albumName[album.id]} 
                    className="text-lg font-bold"
                    onChange={(e) => setAlbumName({ ...albumName, [album.id]: e.target.value })}
                  />
                  <Save 
                    className="cursor-pointer mx-2 text-green-500" 
                    onClick={() => handleSaveAlbum(album.id)}
                  />
                </>
              ) : (
                <h2 
                  className="cursor-pointer text-lg font-bold"
                  onClick={() => toggleAlbumVisibility(album.id)}
                >
                  {album.name}
                </h2>
              )}
            </div>

            <div className="flex items-center">
              {!editingAlbum[album.id] && (
                <Edit3 
                  className="cursor-pointer mx-2 text-yellow-500" 
                  onClick={() => handleEditAlbum(album.id, album)} 
                />
              )}
              <Trash2 
                className="cursor-pointer mx-2 text-red-500" 
                onClick={() => handleDeleteAlbum(album.id)} 
              />

              {expandedAlbums[album.id] ? (
                <ChevronUp className="cursor-pointer" onClick={() => toggleAlbumVisibility(album.id)} />
              ) : (
                <ChevronDown className="cursor-pointer" onClick={() => toggleAlbumVisibility(album.id)} />
              )}
            </div>
          </div>

          {expandedAlbums[album.id] && (
            <ul className="mt-2">
              {album.songs?.map((song) => (
                <li key={song.id} className="flex justify-between items-center py-1">
                  <div className="flex items-center">
                    {editingSong[song.id] ? (
                      <>
                        <input 
                          type="text" 
                          value={songName[song.id]} 
                          className="pl-4"
                          onChange={(e) => setSongName({ ...songName, [song.id]: e.target.value })}
                        />
                        <Save 
                          className="cursor-pointer mx-2 text-green-500" 
                          onClick={() => handleSaveSong(song.id)}
                        />
                      </>
                    ) : (
                      <span className="pl-4">{song.name}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    {!editingSong[song.id] && (
                      <Edit3 
                        className="cursor-pointer mx-2 text-yellow-500" 
                        onClick={() => handleEditSong(song.id, song)} 
                      />
                    )}
                    <Trash2 
                      className="cursor-pointer mx-2 text-red-500" 
                      onClick={() => handleDeleteSong(song.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManageSongs;
