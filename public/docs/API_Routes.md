# API Routes

## User


## Songs
- Logged in or not logged in user can view all songs
    - `Get api/songs`

### Albums
- User can view Album details by clicking album name on song
    - `Get api/album/:albumId`

### Playlists
- Logged in user can view all their playlists
    - `Get api/playlists/:userId`
- Logged in user can view details of specific playlist
    - `Get api/plalist/:playlistId`