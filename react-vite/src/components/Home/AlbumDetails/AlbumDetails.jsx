import { useLoaderData } from 'react-router-dom';
import AudioPlayer from '../../AudioPlayer';

const AlbumDetails = () => {
  const album = useLoaderData();

  return <>{album && <AudioPlayer list={album} />}</>;
};

export default AlbumDetails;
