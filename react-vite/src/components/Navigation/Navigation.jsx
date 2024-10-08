import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const user = useSelector(store => store.session.user);
  const [showMenu, setShowMenu] = useState(false);

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

  return (
    <>
      {user ? (
        <ul className='flex justify-between mx-8 mt-4 text-lg'>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          <li>
            <ProfileButton />
          </li>
        </ul>
      ) : (
        <> </>
      )}
    </>
  );
};

export default Navigation;
