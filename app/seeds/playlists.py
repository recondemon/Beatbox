from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre
Playlist = Models.Playlist
PlaylistSong = Models.PlaylistSong


def seed_playlists():
    artists = Artist.query.all()
    playlists = []
    for artist in artists:
        playlists.append(
            Playlist(
                name="Liked",
                description="These are the songs you have liked",
                is_public=False,
                owner_id=artist.id,
            )
        )
        playlists.append(
            Playlist(
                name="Queue",
                description="These are the songs you have queued up to listen to",
                is_public=False,
                owner_id=artist.id,
            )
        )
        playlists.append(
            Playlist(
                name="Library",
                description="These are the songs you have added to your library",
                is_public=False,
                owner_id=artist.id,
            )
        )
        playlist = Playlist(
            name=artist.first_name + "'s Playlist 1",
            description="Here are my favorite songs in my playlist 1 for everyone to see",
            is_public=True,
            owner_id=artist.id,
        )
        playlists.append(playlist)
        playlists.append(
            Playlist(
                name=artist.first_name + "'s Playlist 2",
                description="Here are my favorite songs in my playlist 2 for everyone to see",
                is_public=True,
                owner_id=artist.id,
            )
        )
        playlists.append(
            Playlist(
                name=artist.first_name + "'s Playlist 3",
                description="Here are my favorite songs in my playlist 3 for only me to see",
                is_public=False,
                owner_id=artist.id,
            )
        )
        song_index = 0
        for song in artist.songs:
            playlists.append(
                PlaylistSong(playlist=playlist, song_id=song.id, song_index=song_index)
            )
            song_index += 1

    db.session.add_all(playlists)
    db.session.commit()


def undo_playlists():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlists RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM playlists"))
    db.session.commit()
