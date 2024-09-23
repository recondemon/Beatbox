import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Home from '../components/Home/Home';
import PlaylistDetails from '../components/Home/PlaylistDetails/PlaylistDetails';
import AlbumDetails from '../components/Home/AlbumDetails/AlbumDetails';
import ArtistDetails from '../components/Home/ArtistDetails/ArtistDetails';
import ManageSongs from '../components/ManageSongs/ManageSongs';

export const router = createBrowserRouter([
  {
    element: <Layout />,
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
        loader: async ({ params }) => {
          const { albumId } = params;
          const res = await fetch(`/api/albums/${albumId}`);
          const album = await res.json();
          return album;
        },
      },
      {
        path: '/artists/:artistId',
        element: <ArtistDetails />,
      },
      {
        path: '/playlist/:playlistId',
        element: <PlaylistDetails />,
        loader: async ({ params }) => {
          const { playlistId } = params;
          const res = await fetch(`/api/playlists/${playlistId}`);
          const playlist = await res.json();
          return playlist;
        },
      },
      {
        path: '/manage',
        element: <ManageSongs />,
      },
    ],
  },
]);
