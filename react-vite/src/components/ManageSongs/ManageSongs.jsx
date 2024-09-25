import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbumsByUserId, editAlbum, removeAlbum } from '../../redux/albums';
import { editSong, removeSong } from '../../redux/songs';
import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Edit3, Trash2, Save } from 'lucide-react';

const ManageSongs = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.albums.isLoading);
  const user = useSelector((state) => state.session.user);
  const [albums, setAlbums] = useState([]);
  const [expandedAlbums, setExpandedAlbums] = useState({});
  const [editing, setEditing] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [albumName, setAlbumName] = useState({});
  const [songName, setSongName] = useState({});

  useEffect(() => {
    console.log(user);
    if (user) {
      setAlbums(user.albums || []);
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading albums...</div>;
  }
  
  if (!albums || albums.length === 0) {
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

  return (
    <div className="flex flex-col mx-auto mt-6 w-3/5 py-6 items-center border-2 border-border rounded-lg min-h-[70vh]">
      <h1>Manage Songs</h1>

      {albums.map((album) => {
        const artist =
          album.artist?.[0]?.band_name ||
          `${album.artist?.[0]?.first_name} ${album.artist?.[0]?.last_name}` ||
          'Unknown Artist';
        const releaseYear = album.release_date
          ? new Date(album.release_date).getFullYear()
          : 'Unknown Year';
        const songCount = album.songs?.length || 0;

        return (
          <div key={album.id}>
            <div className="flex gap-2 items-center justify-center mx-auto">
              <div className="h-[15vh] w-auto">
                {editingImage ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      dispatch(editAlbum(album.id, { file }));
                    }}
                  />
                ) : (
                  <div className='h-[20vh] w-auto'>
                    <img
                      src={album.album_cover}
                      alt="album artwork"
                      className="w-full h-full object-cover"
                    />
                    <button
                    className='mt-2 border-2 border-border bg-muted p-2 rounded-lg'
                    onClick={() => setEditingImage(true)}
                    >
                      Change Album Cover
                    </button>
                  </div>
                  )}
              </div>
              <div className="flex flex-col justify-center h-full">
                {editing ? (
                  <input
                    type="text"
                    value={albumName[album.id] || album.name}
                    onChange={(e) =>
                      setAlbumName({ ...albumName, [album.id]: e.target.value })
                    }
                  />
                ) : (
                  <h1 className="text-3xl font-bold">{album.name}</h1>
                )}
                
                <p className="text-sm">
                  {releaseYear} • {songCount}{' '}
                  {songCount === 1 ? 'song' : 'songs'}
                </p>
                {editing ? (
                  <div className='w-[20vw] h-full'>
                    <textarea
                      value={album.description}
                      onChange={(e) =>
                        dispatch(editAlbum(album.id, { description: e.target.value }))
                      }
                      placeholder="Enter album description"
                      className="bg-input text-secondary-foreground p-2 mt-2 w-full"
                    />
                  </div>
                ) : (
                  <p className="text-sm py-2 text-wrap max-w-[20vw]">
                    {album.description}
                  </p>
                )}
              </div>
              <div>
                {expandedAlbums[album.id] ? (
                  <ChevronUp
                    onClick={() =>
                      setExpandedAlbums({
                        ...expandedAlbums,
                        [album.id]: false,
                      })
                    }
                  />
                ) : (
                  <ChevronDown
                    onClick={() =>
                      setExpandedAlbums({
                        ...expandedAlbums,
                        [album.id]: true,
                      })
                    }
                  />
                )}
              </div>
              <div className="ml-4">
                {editing ? (
                  <Save onClick={() => handleSaveAlbum(album.id)} />
                ) : (
                  <Edit3 onClick={handleEditToggle} />
                )}
              </div>
            </div>
            {/* songs */}
            {expandedAlbums[album.id] && (
              <div className='flex flex-col gap-2 mt-[11vh]'>
                {user.songs?.map((song) => (
                  <div className="flex items-center" key={song.id}>
                    {editing ? (
                      <input
                        type="text"
                        value={songName[song.id] || song.name}
                        onChange={(e) =>
                          setSongName({
                            ...songName,
                            [song.id]: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p>{song.name}</p>
                    )}
                    {editing && (
                      <div className='flex gap-4'>
                        <Save
                          className="ml-2"
                          onClick={() => handleSaveSong(song.id)}
                        />
                        <Trash2
                          className="ml-4"
                          onClick={() => dispatch(removeSong(song.id))}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ManageSongs;
