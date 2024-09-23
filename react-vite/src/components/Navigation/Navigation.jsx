import React from 'react';
import OpenModalMenuItem from './OpenModalMenuItem';
import ProfileButton from './ProfileButton';
import UploadSongModal from '../UploadSong/UploadSongModal';
const Navigation = () => {
  return (
    <ul className="flex justify-between mx-8 mt-2 text-lg">
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <OpenModalMenuItem
          modalComponent={<UploadSongModal />}
          itemText="Upload Song"
        />
      </li>
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
};

export default Navigation;
