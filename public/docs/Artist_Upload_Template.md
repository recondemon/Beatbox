# Template for seeding Artist, Album, and songs in one file

follow comments are replace apropraite items
```python
from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre

# replace "seed_artist_template" with "seed_" then artist name in snake case
def seed_artist_template():
    #replace "ARTIST_NAME" with artist name
    artist = Artist.query.filter_by(band_name="ARTIST_NAME").first()
    #replace all values
    if not artist:
        artist = Artist(
            band_name="ARTIST_NAME",
            email="ARTIST_EMAIL",
            password="ARTIST_PASSWORD",
            first_name="ARTIST_FIRST_NAME",
            last_name="ARTIST_LAST_NAME",
            bio="ARTIST_BIO"
        )
        db.session.add(artist)

    #replace "GENRE_NAME" with the genre
    genre = Genre.query.filter_by(name="GENRE_NAME").first()
    
    if not genre:
        #replace again here
        genre = Genre(name="GENRE_NAME")
        db.session.add(genre)

    
    album = Album.query.filter_by(name="ALBUM_NAME", artist_id=artist.id).first()

    if not album:
        #replace "ALBUM_NAME", "ALBUM_DESCRIPTION", "ALBUM_YEAR, ALBUM_MONTH, ALBUM_DAY" and add url for image
        album_cover_url = "ALBUM_COVER_URL"
        album = Album(
            name="ALBUM_NAME",
            description="ALBUM_DESCRIPTION",
            release_date=datetime(ALBUM_YEAR, ALBUM_MONTH, ALBUM_DAY),
            artist=artist,
            album_cover=album_cover_url,
        )
        db.session.add(album)

    #Add song names and urls
    songs = [
        {
            "name": "SONG_NAME_1",
            "url": "SONG_URL_1",
        },
        {
            "name": "SONG_NAME_2",
            "url": "SONG_URL_2",
        },
        {
            "name": "SONG_NAME_3",
            "url": "SONG_URL_3",
        },
        {
            "name": "SONG_NAME_4",
            "url": "SONG_URL_4",
        },
        {
            "name": "SONG_NAME_5",
            "url": "SONG_URL_5",
        },
    ]

    for song_data in songs:
        existing_song = Song.query.filter_by(name=song_data["name"], album_id=album.id).first()

        if not existing_song:
            new_song = Song(
                name=song_data["name"],
                url=song_data["url"],
                album=album,
                artist=artist,
                genre=genre,
            )
            db.session.add(new_song)

    db.session.commit()

#replace with same as declaration at top
def undo_artist_template():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM artists"))
        db.session.execute(text("DELETE FROM songs"))
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()
```