import {useState, useEffect } from 'react'

const SongDetails = () => {
    const [genres, setGenres] = useState([])
    const [selectedGenre, setSelectedGenre] = useState('')
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('/genres/')
                const data = await response.json()
                setGenres(data)
            } catch (error) {
                console.error('Error fetching genres:', error)
            }
        }
        fetchGenres()
    }, [])
    
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