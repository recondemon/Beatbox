from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre


def seed_toby_keith():
    artist = Artist.query.filter_by(band_name="Toby Keith").first()

    if not artist:
        artist = Artist(
            band_name="Toby Keith",
            email="tobyk@google.com",
            password="password",
            first_name="Toby",
            last_name="Keith",
            bio="Toby Keith is an American country music singer, songwriter, and record producer. He gained fame in the early 1990s with his debut single 'Should’ve Been a Cowboy,' and went on to become one of country music’s most successful artists. Known for his patriotic songs and energetic performances, Keith has released numerous hits including 'Courtesy of the Red, White, and Blue,' 'As Good As I Once Was,' and 'Beer For My Horses.' Over his career, he has earned multiple awards and sold millions of albums worldwide.",
        )
        db.session.add(artist)

    genre = Genre.query.filter_by(name="Country").first()

    if not genre:
        # replace again here
        genre = Genre(name="Country")
        db.session.add(genre)

    album = Album.query.filter_by(name="Unleashed", artist_id=artist.id).first()

    if not album:
        album_cover_url = "https://beatbox-album-art.s3.us-east-2.amazonaws.com/Toby+Keith/Unleashed.jpg"
        album = Album(
            name="Unleashed",
            description="Unleashed is the seventh studio album by American country music artist Toby Keith. It was released in July 2002 via DreamWorks Records Nashville. The album produced four hit singles on the US Billboard Hot Country Songs charts with 'Courtesy of the Red, White, and Blue (The Angry American),' 'Who’s Your Daddy?,' 'Rock You Baby,' and 'Beer for My Horses.' Unleashed was certified 4× Platinum by the RIAA and has sold over 4 million copies in the US.",
            release_date=datetime(2002, 7, 23),
            artist=artist,
            album_cover=album_cover_url,
        )
        db.session.add(album)

    songs = [
        {
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Toby+Keith/Courtesy+Of+The+Red%2C+White%2C+and+Blue.mp3",
            "name": "Courtesty Of The Red, White, and Blue",
        },
        {
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Toby+Keith/Beer+For+My+Horses.mp3",
            "name": "Beer For My Horses",
        },
        {
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Toby+Keith/It+Works+For+Me.mp3",
            "name": "It Works For Me",
        },
        {
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Toby+Keith/Who's+Your+Daddy.mp3",
            "name": "Who's Your Daddy",
        },
        {
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Toby+Keith/Good+To+Go+To+Mexico.mp3",
            "name": "Good To Go To Mexico",
        },
    ]

    for song_data in songs:
        existing_song = Song.query.filter_by(
            name=song_data["name"], album_id=album.id
        ).first()

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


def undo_toby_keith():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM artists"))
        db.session.execute(text("DELETE FROM songs"))
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()
