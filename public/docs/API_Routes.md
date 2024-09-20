# API Routes

## User

## Songs

- Logged in or not logged in user can view all songs
  - `Get api/songs`
- Logged in user can create a song

  - `Post api/songs`

- SONG FORM:
```javascript
//REQUEST
{
    file:soundFile,
    name: name,
    genre: genreName,
    album_id: idOfParentAlbum
}
//RESPONSE
{
    id: songId,
    url:soundFileURL,
    name: name,
    genreID: idOfGenre,
    album_id: idOfParentAlbum,
    {...relatedData}
}
```

### Albums

- User can view Album details by clicking album name on song
  - `Get api/album/:albumId`

### Playlists

- Logged in user can view all their playlists
  - `Get api/playlists/my-playlists`
- Logged in user can view details of specific playlist
  - `Get api/playlists/:playlistId`
- User can view all playlists that are public
  - `Get api/playlists`
- Logged in user can create their own playlist
  - `Post api/playlists`
- Logged in user can edit their own playlist
  - `Post api/playlists/:playlistId`
- Logged in user can add songs to their playlist with an array of song_ids
  - `Post api/playlists/:playlistId/songs`
- PLAYLIST FORM:
```javascript
//REQUEST
{
    name: name,
    description: description,
    is_public: isItAPublicPlaylist,
}
//RESPONSE
{
    id: playlistId,
    name: name,
    description: description,
    isPublic: isItAPublicPlaylist,
    {...relatedData}
}
```