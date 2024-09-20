import { useLoaderData } from 'react-router-dom';
import AudioCard from '../../AudioCard';

const AlbumDetails = () => {
  const album = useLoaderData();

  return <>{album && <AudioCard list={album} />}</>;
};

export default AlbumDetails;
