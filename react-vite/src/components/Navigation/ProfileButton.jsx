import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from '../../redux/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector(store => store.session.user);
  const ulRef = useRef();

  const toggleMenu = e => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = e => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = e => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  const manageSongs = () => {
    closeMenu();
    // Navigate to manage songs page
    
  }

  return (
    <>
      <button onClick={toggleMenu}>
        <FaUserCircle size={24} />
      </button>
      {showMenu && (
        <ul
          className='absolute right-0 mr-4 shadow-shadow text-base border px-3 py-2'
          ref={ulRef}
        >
          {user ? (
            <>
              <li className='hover:cursor-pointer'>{user.username}</li>
              <li className='hover:cursor-pointer'>{user.email}</li>
              <li className='hover:cursor-pointer'>
                <button onClick={manageSongs}>Manage Songs</button>
              </li>
              <li className='hover:cursor-pointer'>
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText='Log In'
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText='Sign Up'
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
