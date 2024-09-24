import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbumsByUserId } from '../../redux/albums';
import { useEffect } from 'react';
import { selectAlbumsArray } from '../../redux/albums';

const ManageSongs = () => {
  const dispatch = useDispatch();
  const albums = useSelector(selectAlbumsArray);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchAlbumsByUserId(user.id)); 
    }
  }, [dispatch, user]);

  if (!albums || albums.length === 0) {
    return <div>Loading albums...</div>; 
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {albums.map((album) => (
        <div key={album.id} className="flex flex-col">
          <h2>{album.name}</h2>
          <ul>
            {album.Songs?.map((song) => (
              <li key={song.id}>{song.title}</li>
            ))} 
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ManageSongs;
