import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ModalProvider, Modal } from '../context/Modal';
import { thunkAuthenticate } from '../redux/session';
import Navigation from '../components/Navigation/Navigation';
import Sidebar from '../components/Home/Sidebar';
import { useSelector } from 'react-redux';
import { fetchQueue, selectQueue } from '../redux/playlists';
import AudioPlayer from '../components/AudioPlayer';
export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const queue = useSelector(selectQueue);
  useEffect(() => {
    dispatch(fetchQueue());
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        <Sidebar />
        {isLoaded && <Outlet />}
        <AudioPlayer list={queue || null} />
        <Modal />
      </ModalProvider>
    </>
  );
}
