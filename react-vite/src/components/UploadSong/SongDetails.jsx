import React from 'react'

const SongDetails = () => {

    const genres = [
        "rock",
        "rap",
        "pop",
        "country",
    ]

  return (
    <div className='flex flex-col mt-4 p-4'>
        <div className='flex gap-2'>
            <input
            id='song-name'
            type='text'
            placeholder='Song Name'
            className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg'
            />
            <select 
            id='genre'
            type='text'
            placeholder='Genre'
            className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg'
            >
                <option value=''>Select Genre</option>
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
                
            

        </div>
    </div>
  )
}

export default SongDetails