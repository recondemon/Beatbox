import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbumsByUserId, editAlbum, removeAlbum } from '../../redux/albums';
import { editSong, removeSong } from '../../redux/songs'; // Assuming you have song actions in songs.js
import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Edit3, Trash2 } from 'lucide-react';

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
    if (editingAlbum[albumId]) {
      dispatch(editAlbum(albumId, { name: albumName[albumId] }));
    }
  };

  const handleEditSong = (songId, song) => {
    setEditingSong((prevState) => ({
      ...prevState,
      [songId]: !prevState[songId],
    }));
    if (editingSong[songId]) {
      dispatch(editSong(songId, { name: songName[songId] }));
    }
  };

  const handleDeleteAlbum = (albumId) => {
    dispatch(removeAlbum(albumId));
  };

  const handleDeleteSong = (songId) => {
    dispatch(removeSong(songId));
  };

  return (
    <div className="flex flex-col justify-center items-center mt-6">
      <h1 className='text-2vw'>Manage Songs</h1>
      {albums.map((album) => (
        <div key={album.id} className="flex flex-col w-full max-w-md p-4 border-b mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={album.albumCover} alt={album.name} className="w-12 h-12 mr-4" />

              {editingAlbum[album.id] ? (
                <input 
                  type="text" 
                  defaultValue={album.name} 
                  className="text-lg font-bold"
                  onChange={(e) => setAlbumName({ ...albumName, [album.id]: e.target.value })}
                />
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
              <Edit3 
                className="cursor-pointer mx-2" 
                onClick={() => handleEditAlbum(album.id, album)} 
              />
              <Trash2 
                className="cursor-pointer mx-2" 
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
                      <input 
                        type="text" 
                        defaultValue={song.name} 
                        className="pl-4"
                        onChange={(e) => setSongName({ ...songName, [song.id]: e.target.value })}
                      />
                    ) : (
                      <span className="pl-4">{song.name}</span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <Edit3 
                      className="cursor-pointer mx-2" 
                      onClick={() => handleEditSong(song.id, song)} 
                    />
                    <Trash2 
                      className="cursor-pointer mx-2" 
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
