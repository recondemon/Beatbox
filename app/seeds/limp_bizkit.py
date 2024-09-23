from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre


def seed_limp_bizkit():
    #replace "ARTIST_NAME" with artist name
    artist = Artist.query.filter_by(band_name="Limp Bizkit").first()
    #replace all values
    if not artist:
        artist = Artist(
            band_name="Limp Bizkit",
            email="fredd@google.com",
            password="password",
            first_name="Fred",
            last_name="Durst",
            bio="Limp Bizkit is an American nu-metal band formed in 1994 in Jacksonville, Florida. The group is led by frontman Fred Durst \(vocals\), along with Wes Borland \(guitar\), Sam Rivers \(bass\), John Otto \(drums\), and DJ Lethal \(turntables\). Known for their aggressive sound and Durst’s mix of rapping and singing, Limp Bizkit gained mainstream success with hits like 'Break Stuff' and 'Nookie.' Their album 'Significant Other' \(1999\) and 'Chocolate Starfish and the Hot Dog Flavored Water' \(2000\) became defining releases in the nu-metal genre."
        )
        db.session.add(artist)

    #replace "GENRE_NAME" with the genre
    genre = Genre.query.filter_by(name="Hip Hop").first()
    
    if not genre:
        #replace again here
        genre = Genre(name="Hip Hop")
        db.session.add(genre)

    
    album = Album.query.filter_by(name="Chocolate Starfish And The Hotdog Flavored Water", artist_id=artist.id).first()

    if not album:
        #replace "ALBUM_NAME", "ALBUM_DESCRIPTION", "ALBUM_YEAR, ALBUM_MONTH, ALBUM_DAY" and add url for image
        album_cover_url = "https://beatbox-album-art.s3.us-east-2.amazonaws.com/Limp+Bizkit/Limp_Bizkit_Chocolate_Starfish_and_the_Hotdog_Flavored_Water.jpg"
        album = Album(
            name="Chocolate Starfish And The Hotdog Flavored Water",
            description="Chocolate Starfish and the Hot Dog Flavored Water is the third studio album by Limp Bizkit, released in 2000. The album features a mix of nu-metal, rap-rock, and hip-hop influences, with aggressive lyrics and heavy guitar riffs.",
            release_date=datetime(2000, 10, 17),
            artist=artist,
            album_cover=album_cover_url,
        )
        db.session.add(album)

    #Add song names and urls
    songs = [
        {
            "name": "Rollin'(Air Raid Vehicle)",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Limp+Bizkit/Rollin'(Air+Raid+Vehicle).mp3",
        },
        {
            "name": "My Way",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Limp+Bizkit/My+Way.mp3",
        },
        {
            "name": "My Generation",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Limp+Bizkit/My+Generation.mp3",
        },
        {
            "name": "Take A Look Around",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Limp+Bizkit/Take+A+Look+Around.mp3",
        },
        {
            "name": "Hot Dog",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Limp+Bizkit/Hot+Dog.mp3",
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
def undo_limp_bizkit():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM artists"))
        db.session.execute(text("DELETE FROM songs"))
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()