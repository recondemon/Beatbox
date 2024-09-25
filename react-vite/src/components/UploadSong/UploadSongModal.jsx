import { useState } from 'react';
import AlbumDetails from './AlbumDetails';
import SongDetails from './SongDetails';

const UploadSongModal = () => {
const [albumId, setAlbumId] = useState('')
  
  return (
    <div className="p-4 bg-card min-w-[40vw]">
      <h2 className="text-2xl font-bold mb-4">Upload Your Song</h2>
      <AlbumDetails setAlbumId = {setAlbumId}/>
      <SongDetails albumId = {albumId} />
      
    </div>
  );
};

export default UploadSongModal;
