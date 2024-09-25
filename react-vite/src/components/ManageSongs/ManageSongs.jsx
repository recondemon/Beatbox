import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbumsByUserId, editAlbum, removeAlbum } from '../../redux/albums';
import { editSong, removeSong } from '../../redux/songs';
import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Edit3, Trash2, Save } from 'lucide-react';

const ManageSongs = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.albums.isLoading);
  const user = useSelector((state) => state.session.user);
  const [albumsSongs, setAlbumsSongs] = useState({
    albums: [],
    songs: []
  });

  const [expandedAlbums, setExpandedAlbums] = useState({});
  const [editing, setEditing] = useState(false);
  const [editingImage, setEditingImage] = useState(false);


  const [albumName, setAlbumName] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');



  useEffect(() => {
    console.log('User:', user);
    if (user) {
      setAlbumsSongs({
        albums: user.albums || [],
        songs: user.songs || []
      });
      console.log(albumsSongs.albums, albumsSongs.songs); 
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading albums...</div>;
  }
  
  if (!albumsSongs.albums || albumsSongs.albums.length === 0) {
    return <div>No albums found</div>;
  }

  const handleEditToggle = () => {
    setEditing((prev) => !prev);
  };

  const handleSaveAlbum = (albumId) => {
    dispatch(editAlbum(albumId, { name: albumName[albumId] }));
    setEditing(false);
  };

  const handleSaveSong = (songId) => {
    dispatch(editSong(songId, { name: songName[songId] }));
    setEditing(false);
  };

  const handleDeleteAlbum = (albumId) => {
    dispatch(removeAlbum(albumId));
  }

  return (
    <div className="flex flex-col mx-auto mt-6 w-4/5 py-6 items-center min-h-[70vh]">
      <h1>Manage Songs</h1>
      <div 
      className='grid grid-cols-2 gap-4'
      >
        {albumsSongs.albums.map((album => ( 
        <div className='bg-card'>
            <div className='flex'>
              <div className='flex flex-col gap-4 p-4'>
                <div 
                  className='w-[10vw] h-auto'
                >
                  <img 
                  src={album.album_cover} 
                  alt='album cover' 
                  className='w-full h-full object-cover' />
                </div>
                <button className='border-2 border-border rounded-lg bg-muted p-2'>
                    Change album cover
                </button>
              </div>
              <div className='flex flex-col p-4 gap-2'>
                {editing ? (
                  <input
                    type='text'
                    value={album.name}
                    onChange={(e) => setAlbumName(e.target.value)}
                    className='bg-input text-secondary-foreground p-2 w-full'
                  />
                ) : (
                  <h1>
                    {album.name}
                  </h1>
                )}
                {editing ? (
                  <input
                    type='date'
                    value={album.release_date}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className='bg-input text-secondary-foreground p-2 w-full'
                  />
                ) : (
                  <h1>
                    {album.release_date}
                  </h1>
                )}
                {editing ? (
                  <textarea
                    type='text'
                    value={album.description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='bg-input text-secondary-foreground p-2 w-full'
                  />
                ) : (
                  <h1>
                    {album.description}
                  </h1>
                )}
              </div>
              <div className='pr-2 pt-2'>
                {editing ? (
                  <button
                    onClick={() => handleSaveAlbum(album.id)}
                    className='p-2 text-green-600 rounded-lg'
                  >
                    <Save />
                  </button>
                ) : (
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setEditing(true)}
                      className='p-2 text-yellow-500 rounded-lg'
                    >
                      <Edit3 />
                    </button>
                    <button
                      onClick={handleDeleteAlbum}
                      className='p-2 text-red-500 rounded-lg'
                    >
                      <Trash2 />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* need to add songs here */}
            <div className="mt-1 text-1vw px-4">
              <h1>Songs - {albumsSongs.songs.filter(song => song.album_id === album.id).length}
              </h1>
              {albumsSongs.songs.filter(song => song.album_id === album.id).map((song) => (
                <p 
                key={song.id}
                className='mt-2'
                >
                  {song.name}
                </p>
              ))}
            </div>
        </div>
        )))}
      </div>
    </div>
  );
};

export default ManageSongs;
