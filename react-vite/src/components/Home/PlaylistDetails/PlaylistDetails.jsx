import { useLoaderData } from 'react-router-dom';
import AudioCard from '../../AudioCard';

const PlaylistDetails = () => {
  const playlist = useLoaderData()

  return <>{playlist && <AudioCard list={playlist} />}</>;
}

export default PlaylistDetails
