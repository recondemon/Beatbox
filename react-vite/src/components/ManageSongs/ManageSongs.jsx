import { useDispatch, useSelector } from 'react-redux';
import { fetchSongs, selectSongsArray } from '../../redux/songs';
import { useEffect } from 'react';
const ManageSongs = () => {
  const dispatch = useDispatch();
  const songs = useSelector(selectSongsArray);


  return (
    <div className="flex flex-col">
      {/* songs */}
      {/* albums */}
      {/* playlists */}
    </div>
  )
}

export default ManageSongs