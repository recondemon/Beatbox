import OpenModalMenuItem from './OpenModalMenuItem';
import ProfileButton from './ProfileButton';

const Navigation = () => {
  return (
    <ul className="flex justify-between mx-8 mt-2 text-lg">
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
};

export default Navigation;
