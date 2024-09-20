from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre


# Linkin Park Seed
def seed_linkin_park():
    linkin_park = Artist(
        band_name="Linkin Park",
        email="hello@yahoo.com",
        password="password",
        first_name="Chester",
        last_name="Bennington",
        bio="Legend"
    )
    db.session.add(linkin_park)

    genre_rock = Genre.query.filter_by(name="Rock").first()

    # Check if Album exists

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
        # Check if the song exists

        new_song = Song(
            name=song_data["name"],
            url=song_data["url"],
            album=hybrid_theory,
            artist=linkin_park,
            genre=genre_rock,
        )
        db.session.add(new_song)

    # Commit
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
