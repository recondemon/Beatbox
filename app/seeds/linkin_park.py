from datetime import datetime
from flask import Flask
from models import db, Song, Album, Artist, Genre

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'your_database_uri_here'
db.init_app(app)

# Linkin Park Seed
def seed_linkin_park():
    # Check if Artist exists
    artist = Artist.query.filter_by(band_name='Linkin Park').first()
    if not artist:
        # Create the Artist
        linkin_park = Artist(band_name='Linkin Park')
        db.session.add(linkin_park)
        db.session.commit()
    else:
        linkin_park = artist
        print("Artist Linkin Park already exists in the database.")

    # Check if Genre exists
    genre_rock = Genre.query.filter_by(name='Rock').first()
    if not genre_rock:
        genre_rock = Genre(name='Rock')
        db.session.add(genre_rock)
        db.session.commit()
    else:
        print("Genre Rock already exists in the database.")

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
