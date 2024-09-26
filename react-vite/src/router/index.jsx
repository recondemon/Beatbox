import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Home from '../components/Home/Home';
import PlaylistDetails from '../components/Home/PlaylistDetails/PlaylistDetails';
import AlbumDetails from '../components/Home/AlbumDetails/AlbumDetails';
import ArtistDetails from '../components/Home/ArtistDetails/ArtistDetails';
import ManageSongs from '../components/ManageSongs/ManageSongs';
import ManagePlaylists from '../components/ManagePlaylists/ManagePlaylists';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    loader: async () => {
      const likedRes = await fetch('/api/playlists/liked');
      const currRes = await fetch('/api/playlists/current');
      const liked = await likedRes.json();
      const currPlaylists = await currRes.json();
      return { liked, currPlaylists };
    },
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'login',
        element: <LoginFormPage />,
      },
      {
        path: 'signup',
        element: <SignupFormPage />,
      },
      {
        path: '/album/:albumId',
        element: <AlbumDetails />,
      },
      {
        path: '/artists/:artistId',
        element: <ArtistDetails />,
      },
      {
        path: '/playlist/:playlistId',
        children: [
          {
            index: true,
            element: <PlaylistDetails />,
          },
          {
            path: 'manage',
            element: <ManagePlaylists />,
          },
        ],
      },
      {
        path: '/manage',
        element: <ManageSongs />,
      },
    ],
  },
]);
