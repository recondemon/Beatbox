import {useState, useEffect } from 'react'

const SongDetails = () => {
    const [genres, setGenres] = useState([])
    const [selectedGenre, setSelectedGenre] = useState('')
    const [songName, setSongName] = useState('')
    const [songs, setSongs] = useState([])

    const handleSongNameChange = (e) => {
        setSongName(e.target.value)
    }

    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setSongs([...songs, file
        ])
    }

    //create another song input section
    const handleAddAnotherSong = () => {
        
    }

    const handleUploadSong = async () => {
        //upload song to server
    }

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
            onChange={handleSongNameChange}
            />
            <select 
            id='genre'
            type='text'
            placeholder='Genre'
            className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg'
            onChange={handleGenreChange}
            >
                <option value=''>Select Genre</option>
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
            
        </div>
        <div>
            <input 
            id='song-file'
            type='file'
            accept='audio/*'
            className='w-full bg-input text-secondary-foreground p-2 h-10 rounded-lg mt-4'
            onChange={handleFileChange}
        />
        </div>
        <div className='flex'>
            <button 
            className='text-primary p-2 rounded-lg mt-4 hover:underline hover:cursor-pointer'
            onClick={handleAddAnotherSong}
            >
                + Another Song
            </button>
        </div>
        <div className='flex justify-end'>
            <button
            className='bg-primary p-2 rounded-lg mt-4'
            onClick={handleUploadSong}
            >
                Upload Songs
            </button>
        </div>
    </div>
  )
}

export default SongDetails