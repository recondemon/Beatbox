import React from 'react';
import OpenModalMenuItem from './OpenModalMenuItem';
import UploadSongModal from './UploadSongModal';

const Navigation = () => {
  return (
    <ul className="flex justify-between mx-8 mt-2 text-lg">
      <li>
        {/* Other menu items */}
        <a href="/">Home</a>
      </li>
      <li>
        <OpenModalMenuItem
          modalComponent={<UploadSongModal />}
          itemText="Upload Song"
        />
      </li>
      <li>
        {/* Example profile or other buttons */}
        <a href="/profile">Profile</a>
      </li>
    </ul>
  );
};

export default Navigation;
