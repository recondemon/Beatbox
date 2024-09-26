import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { NavLink } from "react-router-dom";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { useEffect, useState } from "react";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
const Navigation = () => {
  const user = useSelector((store) => store.session.user);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);


  return (
    <ul className="flex justify-between mx-8 mt-4 text-lg">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        {user ? (
          <ProfileButton />
        ):(
          <div className="flex gap-6 mr-4 items-center justify-center">
            <div className="text-primary hover:underline hover:text-foreground text-1.2vw">
              <OpenModalMenuItem
                itemText="Log In"
                // onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>
          </div>
        )}
      </li>
    </ul>
  );
};

export default Navigation;
