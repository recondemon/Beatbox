import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

const AlbumInputs = ({ handleBackToSelect }) => {
    const [newAlbumName, setNewAlbumName] = useState('')
    const [newAlbumDescription, setNewAlbumDescription] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const [albumCover, setAlbumCover] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setAlbumCover(file)
    }

    const handleCreateAlbum = async () => {
        const formData = new FormData()
        formData.append('album_name', newAlbumName)
        formData.append('description', newAlbumDescription)
        formData.append('release_date', releaseDate)
        if (albumCover) {
            formData.append('album_cover', albumCover) // Adding album cover file
        }

        try {
            const response = await fetch('/albums/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token') // Add your auth token if needed
                }
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Album created successfully:', data)
                handleBackToSelect() // Navigate back after album creation
            } else {
                console.error('Error creating album:', response.statusText)
            }
        } catch (error) {
            console.error('Error creating album:', error)
        }
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
                    onClick={handleCreateAlbum}
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
            <div className='flex'>
                <div className='flex flex-col p-4'>
                    <label htmlFor="album-cover">Album Cover:</label>
                    <input 
                        type="file" 
                        id="album-cover" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2"
                    />
                </div>
                {albumCover && (
                    <div className="flex pr-4 py-2 mb-2 justify-center items-center border">
                        <img
                            src={URL.createObjectURL(albumCover)}
                            alt="Album cover preview"
                            className="w-32 h-32 object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default AlbumInputs
