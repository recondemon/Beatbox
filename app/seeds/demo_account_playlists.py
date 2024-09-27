from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre
Playlist = Models.Playlist
PlaylistSong = Models.PlaylistSong



def seed_demo_account_playlists():
    playlists = [
        Playlist(
            name="Ridin' with Biden",
            description="Get in, loser, we’re fixing the economy and dropping beats. Whether you're cruising in a classic 'vette or riding the Amtrak, this playlist is smoother than a Biden press conference. Perfect for long drives, policy debates, or just chilling with your favorite aviators on. Let's go, folks – it's time to turn the volume up to 46!",
            is_public=True,
            owner_id=1
        ),
        Playlist(
            name="Trump's Rally Playlist",
            description="Because every rally needs a soundtrack. From classic rock bangers to tracks as bold as a tweet at 3 AM, this playlist is HUGE! Perfect for celebrations, rallies, and of course... winning.",
            is_public=True,
            owner_id=1
        )
    ]


    db.session.add_all(playlists)
    db.session.commit()

    ridin_with_biden = Playlist.query.filter_by(name="Ridin' with Biden").first()

    biden_songs_1 = [
        PlaylistSong(playlist_id=ridin_with_biden.id, song_id=song_id, song_index=index)
        for index, song_id in enumerate(range(17, 20))
    ]

    biden_songs_2 = [
        PlaylistSong(playlist_id=ridin_with_biden.id, song_id=song_id, song_index=index + len(biden_songs_1))
        for index, song_id in enumerate(range(31, 34))
    ]

    biden_songs = biden_songs_1 + biden_songs_2
    db.session.add_all(biden_songs)

    maga_mix = Playlist.query.filter_by(name="Trump's Rally Playlist").first()
    trump_songs = [
        PlaylistSong(playlist_id=maga_mix.id, song_id=song_id, song_index=index)
        for index, song_id in enumerate(range(21, 30))
    ]

    db.session.add_all(trump_songs)

    db.session.commit()


def undo_demo_account_playlists():
    db.session.execute('TRUNCATE playlists RESTART IDENTITY CASCADE;')
    db.session.execute('TRUNCATE playlist_songs RESTART IDENTITY CASCADE;')
    db.session.commit()
