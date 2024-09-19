import { useState } from 'react'
import AlbumInputs from './AlbumInputs'

const AlbumDetails = () => {
    const [album, setAlbum] = useState('')
    const [creatingAlbum, setCreatingAlbum] = useState(false)

    const albums = []

    const handleCreateAlbumOption = () => {
        setCreatingAlbum(true)
        setAlbum('')
    }

    const handleAlbumChange = (e) => {
        const selectedValue = e.target.value
        if (selectedValue === "create-album") {
            handleCreateAlbumOption()
        } else {
            setAlbum(selectedValue)
        }
    }

    const handleBackToSelect = () => {
        setCreatingAlbum(false)
    }

    return (
        <div className='flex w-full border-b-2 border-border py-4'>
            {creatingAlbum ? (
                <div className="flex flex-col w-full">
                    <AlbumInputs handleBackToSelect={handleBackToSelect} />
                </div>
            ) : (
                <div className='flex w-full gap-4'>
                    <select
                        title='Album'
                        id="album"
                        value={album}
                        onChange={handleAlbumChange}
                        className='w-1/2 bg-input p-2 h-10 rounded-lg'
                    >
                        <option value="">Select Album</option>
                        {albums.length > 0 ? (
                            albums.map((album) => (
                                <option key={album.id} value={album.id}>
                                    {album.name}
                                </option>
                            ))
                        ) : null}
                        <option value="create-album">
                            Create Album
                        </option>
                    </select>
                    <div className='flex justify-center items-center border-2 border-border p-4 w-1/2 min-h-[10rem]'>
                        {album ? (
                            <div>
                                <h2>{album.name}</h2>
                                <p>{album.description}</p>
                            </div>
                        ):( 
                            <h2>No Album Selected</h2>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AlbumDetails
