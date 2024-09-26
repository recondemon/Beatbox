import { useSelector } from 'react-redux';
import { Link, useLoaderData } from 'react-router-dom';

const Sidebar = () => {
  const user = useSelector(state => state.session.user);
  const { liked, currPlaylists } = useLoaderData();

  if (!user) {
    return;
  }

  const filteredPlaylists = currPlaylists?.filter(
    playlist =>
      playlist.name !== 'Liked' && playlist.name !== 'Queue' && playlist.name !== 'Library',
  );

  return (
    currPlaylists && (
      <div className='absolute top-20 left-4'>
        <div className='flex flex-col h-full bg-popover rounded-md'>
          <div className='flex flex-col p-4 gap-4'>
            <Link to={`/playlist/${liked.id}`}>
              <img
                className='w-12 h-12 rounded-md border border-accent'
                src='/liked.jpeg'
                alt='heart logo for favorites playlist'
              />
            </Link>
          </div>

          {filteredPlaylists?.map(playlist => (
            <div
              key={playlist?.id}
              className='flex flex-col p-4 gap-4'
            >
              <Link to={`/playlist/${playlist?.id}`}>
                <img
                  className='w-12 h-12 rounded-md border border-accent'
                  src='/playlist.jpeg'
                  alt='heart logo for favorites playlist'
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Sidebar;
