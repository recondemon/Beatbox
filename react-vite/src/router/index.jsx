import { createBrowserRouter, useParams } from 'react-router-dom';
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
        path: '/albums/:albumId',
        element: <AlbumDetails />,
        loader: async ({ params }) => {
          const { albumId } = params;
          console.log(params);
          const res = await fetch(`/api/album/${albumId}`);
          const album = await res.json();
          return album;
        },
      },
      {
        path: '/artists/:artistId',
        element: <ArtistDetails />,
      },
      {
        path: '/playlists/:playlistId',
        element: <PlaylistDetails />,
        loader: async ({ params }) => {
          const { playlistId } = params;
          console.log(playlistId)
          const res = await fetch(`/api/playlist/${playlistId}`);
          const playlist = await res.json();
          return playlist;
        },
      },
    ],
  },
]);
