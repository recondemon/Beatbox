import ProfileButton from "./ProfileButton";
import { NavLink } from "react-router-dom";
const Navigation = () => {
  return (
    <ul className="flex justify-between mx-8 mt-2 text-lg">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
};

export default Navigation;
