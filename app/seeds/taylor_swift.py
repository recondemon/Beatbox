from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre


def seed_taylor_swift():

    artist = Artist.query.filter_by(band_name="Taylor Swift").first()

    if not artist:
        artist = Artist(
            band_name="Taylor Swift",
            email="taylors@google.com",
            password="password",
            first_name="Taylor",
            last_name="Swift",
            bio="Taylor Swift is an American singer-songwriter who has achieved global success across multiple genres, including country, pop, and indie. She first gained fame in the mid-2000s with her country albums before transitioning to pop with her album '1989' \(2014\), which included major hits like 'Shake It Off,' 'Blank Space,' and 'Bad Blood.' Known for her narrative songwriting and evolving musical style, Swift has won numerous awards and is one of the best-selling music artists of all time."
        )
        db.session.add(artist)


    genre = Genre.query.filter_by(name="Pop").first()
    
    if not genre:

        genre = Genre(name="Pop")
        db.session.add(genre)

    
    album = Album.query.filter_by(name="1989", artist_id=artist.id).first()

    if not album:

        album_cover_url = "https://beatbox-album-art.s3.us-east-2.amazonaws.com/Taylor+Swift/1989.png"
        album = Album(
            name="1989",
            description="1989 is the fifth studio album by American singer-songwriter Taylor Swift, released on October 27, 2014, through Big Machine Records. Following the release of her fourth studio album Red \(2012\), which was heavily pop-influenced, Swift sought to fully move away from country music and establish herself as a pop artist. For her follow-up, she enlisted Max Martin, Shellback, Ryan Tedder, and Jack Antonoff as her primary collaborators. The album also features a guest appearance from Swedish singer Imogen Heap on the track 'Clean.'",
            release_date=datetime(2014, 10, 27),
            artist=artist,
            album_cover=album_cover_url,
        )
        db.session.add(album)

    #Add song names and urls
    songs = [
        {
            "name": "Blank Space",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Taylor+Swift/Blank+Space.mp3",
        },
        {
            "name": "Style",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Taylor+Swift/Style.mp3",
        },
        {
            "name": "Shake It Off",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Taylor+Swift/Shake+It+Off.mp3",
        },
        {
            "name": "Wildest Dreams",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Taylor+Swift/Wildest+Dreams.mp3",
        },
        {
            "name": "Bad Blood",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Taylor+Swift/Bad+Blood.mp3",
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


def undo_taylor_swift():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM artists"))
        db.session.execute(text("DELETE FROM songs"))
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()