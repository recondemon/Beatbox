import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useNavigate } from "react-router-dom";
import UploadSongModal from "../UploadSong/UploadSongModal";
import { fetchArtist, selectArtistById } from "../../redux/artists.js";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  const navigate = useNavigate();
  const artist = useSelector(selectArtistById(user?.id));
  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };
  useEffect(() => {
    if (user) {
      dispatch(fetchArtist(user.id))
    }
  }, [user, dispatch]);

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

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  const manageSongs = () => {
    closeMenu();
    navigate("/manage");
  };

  return (
    <>
      <button onClick={toggleMenu}>
        <FaUserCircle size={24} />
      </button>
      {showMenu && (
        <ul
          className="absolute bg-card flex flex-col right-0 mr-4 gap-4 shadow-shadow text-base border px-3 py-2 rounded-lg"
          ref={ulRef}
        >
          {user ? (
            <>
              <li className="hover:cursor-pointer">
                <div className="flex flex-col gap-2 border-b-2 border-border pb-2">
                  <span>
                    {artist?.firstName || "No first name"}{" "}
                    {artist?.lastName || "No last name"}
                  </span>
                  <span>{user.email}</span>
                </div>
              </li>
              <li className="hover:cursor-pointer">
                <button onClick={manageSongs}>Manage Songs</button>
              </li>
              <OpenModalMenuItem
                modalComponent={<UploadSongModal />}
                itemText="Upload Song"
              />
              <li className="hover:cursor-pointer">
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
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
