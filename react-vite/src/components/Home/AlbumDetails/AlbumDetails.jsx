import { useLoaderData } from "react-router-dom"

const AlbumDetails = () => {
  const album = useLoaderData()
  console.log(album)

  return (
    <>
      {album && (
        <p>Hello World</p>
      )}
    </>
  )
}

export default AlbumDetails
