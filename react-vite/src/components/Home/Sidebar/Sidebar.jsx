import { Link, useLoaderData } from 'react-router-dom';

const Sidebar = () => {
  const likes = useLoaderData();

  return (
    <div className='absolute top-20 left-4'>
      <div className='flex flex-col h-full bg-popover rounded-md'>
        <div className='flex flex-col p-4 gap-4'>
          <Link to={`/playlist/${likes?.id}`}>
            <img
              className='w-12 h-12 rounded-md border border-accent'
              src='../../../../public/liked.jpeg'
              alt='heart logo for favorites playlist'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
