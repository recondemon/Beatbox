from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre



def seed_linkin_park():

    linkin_park = Artist.query.filter_by(band_name="Linkin Park").first()

    if not linkin_park:
        linkin_park = Artist(
            band_name="Linkin Park",
            email="chesterb@google.com",
            password="password",
            first_name="Chester",
            last_name="Bennington",
            bio="Linkin Park is an American rock band formed in 1996 in Agoura Hills, California. Known for blending rock, nu-metal, and electronic music, they achieved worldwide fame with their debut album Hybrid Theory \(2000\). The band’s lineup included Chester Bennington and Mike Shinoda, whose dynamic mix of vocals defined their sound. Hits like 'In the End' and 'Numb' made them one of the most successful bands of the 2000s. After Bennington’s tragic death in 2017, their influence continues to resonate with fans around the world."
        )
        db.session.add(linkin_park)

    genre_rock = Genre.query.filter_by(name="Rock").first()

    if not genre_rock:
        genre_rock = Genre(name="Rock")
        db.session.add(genre_rock)

    hybrid_theory = Album.query.filter_by(name="Hybrid Theory", artist_id=linkin_park.id).first()

    if not hybrid_theory:
        album_cover_url = "https://beatbox-album-art.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory.jpg"
        hybrid_theory = Album(
            name="Hybrid Theory",
            description="Hybrid Theory is the debut album by the American rock band Linkin Park, released in 2000. The album is a fusion of genres that includes rock, metal, rap, and electronic music.",
            release_date=datetime(2000, 10, 24),
            artist=linkin_park,
            album_cover=album_cover_url,
        )
        db.session.add(hybrid_theory)

    songs = [
        {
            "name": "Papercut",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/Papercut.mp3",
        },
        {
            "name": "One Step Closer",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/One+Step+Closer.mp3",
        },
        {
            "name": "In The End",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/In+the+End.mp3",
        },
        {
            "name": "Pushing Me Away",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/Pushing+Me+Away.mp3",
        },
        {
            "name": "Crawling",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/Crawling.mp3",
        },
    ]

    for song_data in songs:
        existing_song = Song.query.filter_by(name=song_data["name"], album_id=hybrid_theory.id).first()

        if not existing_song:
            new_song = Song(
                name=song_data["name"],
                url=song_data["url"],
                album=hybrid_theory,
                artist=linkin_park,
                genre=genre_rock,
            )
            db.session.add(new_song)

    db.session.commit()


def undo_linkin_park():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM artists"))
        db.session.execute(text("DELETE FROM songs"))
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()
