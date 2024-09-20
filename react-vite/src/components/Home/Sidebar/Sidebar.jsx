const Sidebar = () => {
  return (
    <div className='flex flex-col h-full bg-popover rounded-md'>
      <nav className='flex flex-col p-4 gap-4'>
        {/* TODO: Make these links to liked playlists, albums & artists */}
        <p className='border-accent border rounded-sm p-1 w-14 h-14'>A</p>
        <p className='border-accent border rounded-sm p-1 w-14 h-14'>A</p>
        <p className='border-accent border rounded-sm p-1 w-14 h-14'>A</p>
      </nav>
    </div>
  );
};

export default Sidebar;
