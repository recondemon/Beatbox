

const EditPlaylistSongs = () => {
  return (
    <div>
        <ul className='bg-card text-card-foreground w-full border border-border h-2/3 rounded-md'>
        {list?.songs?.length ? (
          list?.songs?.map((song, index) => (
            <li key={song.id} className='flex items-center py-4 hover:bg-muted'>
              {/* Song number */}
              <div className='mr-4'>{index + 1}.</div>

              {/* Song content */}
              <div className='flex w-full mx-2 items-center justify-evenly cursor-pointer'>
                <audio
                  src={song.url}
                  onLoadedMetadata={e => handleLoadedMetadata(song.id, e.target)}
                  className='hidden'
                />

                <div className='flex-1'>
                  <h3
                    className={`font-semibold ${
                      currentSong?.id === song.id ? 'text-green-500' : ''
                    }`}
                  >
                    {song.name}
                  </h3>
                </div>

                <div className='flex-1 text-center'>
                  <p
                    className={`font-semibold ${
                      currentSong?.id === song.id ? 'text-green-500' : ''
                    }`}
                  >
                    {song.artist_id in artists && artists[song.artist_id]}
                  </p>
                </div>

                <div className='flex-1 text-right'>
                  <p
                    className={`font-semibold ${
                      currentSong?.id === song.id ? 'text-green-500' : ''
                    }`}
                  >
                    {songDurations[song.id] ? formatTime(songDurations[song.id]) : '--:--'}
                  </p>
                </div>
              </div>

              {/* Buttons to reorder songs */}
              <div className='flex gap-2'>
                <button onClick={() => moveSongUp(index)} className='text-gray-500'>
                  <ChevronUp />
                </button>
                <button onClick={() => moveSongDown(index)} className='text-gray-500'>
                  <ChevronDown />
                </button>

                {/* Remove song from playlist */}
                <button
                  onClick={() => removeSongFromPlaylist(song.id)}
                  className='text-red-500 ml-2'
                >
                  <Trash2 />
                </button>
              </div>
            </li>
          ))
        ) : (
          <h2 className='text-center text-2xl my-2'>No songs yet</h2>
        )}
      </ul>
    </div>
  )
}

export default EditPlaylistSongs