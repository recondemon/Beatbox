import React from 'react';
import AlbumDetails from './AlbumDetails';
import SongDetails from './SongDetails';

const UploadSongModal = () => {
  const [albumName, setAlbumName] = React.useState('');

  const handleAlbumNameChange = (e) => {
    setAlbumName(e.target.value);
  };
  
  return (
    <div className="p-4 bg-card min-w-[40vw]">
      <h2 className="text-2xl font-bold mb-4">Upload Your Song</h2>
      <AlbumDetails />
      <SongDetails />
    </div>
  );
};

export default UploadSongModal;
