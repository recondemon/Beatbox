import { useLoaderData } from 'react-router-dom';
import AudioPlayer from '../../AudioPlayer';

const PlaylistDetails = () => {
  const playlist = useLoaderData()

  return <>{playlist && <AudioPlayer list={playlist} />}</>;
}

export default PlaylistDetails
