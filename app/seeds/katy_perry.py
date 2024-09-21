from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre


def seed_katy_perry():
    katy_perry = Artist.query.filter_by(band_name="Katy Perry").first()

    if not katy_perry:
        katy_perry = Artist(
            band_name="Katy Perry",
            email="katyp@google.com",
            password="password",
            first_name="Katy",
            last_name="Perry",
            bio="Katy Perry is an American singer, songwriter, and television judge. She rose to fame in 2008 with her hit single 'I Kissed a Girl' from her second album One of the Boys \(2008\). Known for her catchy pop anthems and colorful stage presence, Perry became one of the best-selling music artists of all time, with hits like 'Teenage Dream,' 'Roar,' and 'Firework.' Over her career, she has earned numerous awards and accolades for her impact on the pop music industry."
        )
        db.session.add(katy_perry)

    genre_pop = Genre.query.filter_by(name="Pop").first()

    if not genre_pop:
        genre_pop = Genre(name="Pop")
        db.session.add(genre_pop)

    teenage_dream = Album.query.filter_by(name="Teenage Dream", artist_id=katy_perry.id).first()

    if not teenage_dream:
        album_cover_url = "https://beatbox-album-art.s3.us-east-2.amazonaws.com/Katy+Perry/Teenage+Dream.png"
        teenage_dream = Album(
            name="Teenage Dream",
            description="Teenage Dream is the third studio album by American singer Katy Perry, released in 2010. The album features a mix of pop and dance-pop, with catchy melodies and upbeat lyrics.",
            release_date=datetime(2010, 8, 24),
            artist=katy_perry,
            album_cover=album_cover_url,
        )
        db.session.add(teenage_dream)

    songs = [
        {
            "name": "Firework",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Katy+Perry/Firework.mp3",
        },
        {
            "name": "Last Friday Night \(T.G.I.F.\)",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Katy+Perry/Last+Friday+Night(T.G.I.F.).mp3",
        },
        {
            "name": "The One That Got Away",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Katy+Perry/The+One+That+Got+Away.mp3",
        },
        {
            "name": "California Gurls",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Katy+Perry/California+Gurls.mp3",
        },
        {
            "name": "Teenage Dream",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Katy+Perry/Teenage+Dream.mp3",
        },
    ]

    for song_data in songs:
        existing_song = Song.query.filter_by(name=song_data["name"], album_id=teenage_dream.id).first()

        if not existing_song:
            new_song = Song(
                name=song_data["name"],
                url=song_data["url"],
                album=teenage_dream,
                artist=katy_perry,
                genre=genre_pop,
            )
            db.session.add(new_song)

    db.session.commit()


def undo_katy_perry():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM artists"))
        db.session.execute(text("DELETE FROM songs"))
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()
