import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Home from '../components/Home/Home';
import PlaylistDetails from '../components/Home/PlaylistDetails/PlaylistDetails';
import AlbumDetails from '../components/Home/AlbumDetails/AlbumDetails';
import ArtistDetails from '../components/Home/ArtistDetails/ArtistDetails';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
        loader: async () => {
          const albumsRes = await fetch('/api/albums');
          const albums = await albumsRes.json();
          const playlistsRes = await fetch('/api/playlists');
          const playlists = await playlistsRes.json();
          return { albums, playlists };
        },
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
        loader: async id => {
          const res = await fetch(`/api/album/${id}`);
          const album = await res.json();
          return album;
        },
      },
      {
        path: '/artist/:artistId',
        element: <ArtistDetails />,
      },
      {
        path: '/playlist/:playlistId',
        element: <PlaylistDetails />,
        loader: async id => {
          const res = await fetch(`/api/playlist/${id}`);
          const playlist = await res.json();
          return playlist;
        },
      },
    ],
  },
]);
