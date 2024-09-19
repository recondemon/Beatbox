import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

const AlbumInputs = ({ handleBackToSelect }) => {
    const [newAlbumName, setNewAlbumName] = useState('')
    const [newAlbumDescription, setNewAlbumDescription] = useState('')
    const [releaseDate, setReleaseDate] = useState('') // New state for release date

    const handleSetAlbum = () => {
        // You can handle the album creation logic here, using newAlbumName, newAlbumDescription, and releaseDate
        handleBackToSelect()
    }

    return (
        <div className='flex flex-col border-2 border-border rounded-lg w-4/5'>
            <div className='flex justify-between p-2'>
                <button 
                    onClick={handleBackToSelect} 
                    className="p-2"
                >
                    <ArrowLeft />
                </button>
                <button 
                    onClick={handleSetAlbum}
                    className='bg-primary p-2 rounded-lg'
                >
                    Create Album
                </button>
            </div>
            <div className='flex flex-col w-full p-4 gap-2'>
                <div className='flex flex-col w-full gap-4'>
                    <div className='flex gap-2'>
                        <div>
                            <label htmlFor="album-name">Album Name:</label>
                            <input
                                type="text"
                                value={newAlbumName}
                                onChange={(e) => setNewAlbumName(e.target.value)}
                                placeholder="Enter album name"
                                className='bg-input text-secondary-foreground p-2 w-full mt-2'
                            />
                        </div>
                        <div>
                            <label htmlFor="release-date">Release Date:</label>
                            <input
                                type="date"
                                id="release-date"
                                value={releaseDate}
                                onChange={(e) => setReleaseDate(e.target.value)}
                                className='bg-input text-secondary-foreground p-2 w-full mt-2'
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="album-description">Album Description:</label>
                    <textarea
                        value={newAlbumDescription}
                        onChange={(e) => setNewAlbumDescription(e.target.value)}
                        placeholder='Enter album description'
                        className='bg-input text-secondary-foreground p-2 mt-2 w-full'
                    />
                </div>
            </div>
        </div>
    )
}

export default AlbumInputs
