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
        linkin_park = Artist(band_name='Linkin Park' , first_name='Chester', last_name='Bennington', bio='Linkin Park is an American rock band formed in Agoura Hills, California, in 1996. The band achieved international fame with the release of their debut album, Hybrid Theory (2000), which was certified Diamond by the RIAA in 2005 and multi-Platinum in several other countries. Their early success was driven by a unique blend of nu-metal, rap-rock, and electronic elements, distinguishing them from other bands of the time.')
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
    album = Album.query.filter_by(name='Hybrid Theory', artist_id=linkin_park.id).first()
    if not album:
        # Create the Album
        album_cover_url = 'https://beatbox-album-art.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory.jpg'
        hybrid_theory = Album(
            name='Hybrid Theory',
            description='Hybrid Theory is the debut album by the American rock band Linkin Park, released in 2000. The album is a fusion of genres that includes rock, metal, rap, and electronic music.',
            release_date=datetime(2000, 10, 24),
            artist=linkin_park,
            cover_image=album_cover_url
        )
        db.session.add(hybrid_theory)
        db.session.commit()
    else:
        hybrid_theory = album
        print("Album Hybrid Theory already exists in the database.")

    songs = [
        {'name': 'Papercut', 'url': 'https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/Papercut.mp3'},
        {'name': 'One Step Closer', 'url': 'https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/One+Step+Closer.mp3'},
        {'name': 'In The End', 'url': 'https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/In+the+End.mp3'},
        {'name': 'Pushing Me Away', 'url': 'https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/Pushing+Me+Away.mp3'},
        {'name': 'Crawling', 'url': 'https://beatbox-songs.s3.us-east-2.amazonaws.com/Linkin+Park/Hybrid+Theory/Crawling.mp3'},
    ]

    for song_data in songs:
        # Check if the song exists
        song = Song.query.filter_by(name=song_data['name'], album_id=hybrid_theory.id).first()
        if not song:
            # Create the song
            new_song = Song(
                name=song_data['name'],
                url=song_data['url'],
                album=hybrid_theory,
                artist=linkin_park,
                genre=genre_rock
            )
            db.session.add(new_song)
        else:
            print(f"Song {song_data['name']} already exists in the database.")

    # Commit
    db.session.commit()

    print("Seed data for Linkin Park and Hybrid Theory album created successfully.")



with app.app_context():
    db.create_all()
    seed_linkin_park()
