from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre


def seed_seether():
    seether = Artist.query.filter_by(band_name="Seether").first()

    if not seether:
        seether = Artist(
            band_name="Seether",
            email="shaunm@google.com",
            password="password",
            first_name="Shaun",
            last_name="Morgan",
            bio="Seether is a South African rock band formed in Pretoria in 1999. Initially known as Saron Gas, the band changed its name to Seether in 2002. Fronted by Shaun Morgan \(vocals and guitar\), Seether became known for their post-grunge and alternative metal sound, characterized by emotionally raw lyrics and heavy guitar riffs. Their breakthrough came with the album Disclaimer \(2002\), featuring hits like 'Fine Again' and 'Broken.' Over the years, they have released several successful albums, including Karma and Effect \(2005\) and Holding Onto Strings Better Left to Fray \(2011\), solidifying their place in the global rock scene."
        )
        db.session.add(seether)

    genre_rock = Genre.query.filter_by(name="Rock").first()

    if not genre_rock:
        genre_rock = Genre(name="Rock")
        db.session.add(genre_rock)

    isolate_and_medicate = Album.query.filter_by(name="Isolate and Medicate", artist_id=seether.id).first()

    if not isolate_and_medicate:
        album_cover_url = "https://beatbox-album-art.s3.us-east-2.amazonaws.com/Seether/Isolate+and+Medicate/Isolate+and+Medicate.jpg"
        isolate_and_medicate = Album(
            name="Isolate and Medicate",
            description="Isolate and Medicate is the sixth studio album by South African rock band Seether, released in 2014. The album features a mix of post-grunge and alternative metal, with emotionally raw lyrics and heavy guitar riffs.",
            release_date=datetime(2014, 7, 1),
            artist=seether,
            album_cover=album_cover_url,
        )
        db.session.add(isolate_and_medicate)

    songs = [
        {
            "name": "My Disaster",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Seether/Isolate+and+Medicate/My+Disaster.mp3",
        },
        {
            "name": "Nobody's Praying For Me",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Seether/Isolate+and+Medicate/Nobodys+Praying+For+Me.mp3",
        },
        {
            "name": "Same Damn Life",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Seether/Isolate+and+Medicate/Same+Damn+Life.mp3",
        },
        {
            "name": "Save Today",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Seether/Isolate+and+Medicate/Save+Today.mp3",
        },
        {
            "name": "Words As Weapons",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Seether/Isolate+and+Medicate/Words+As+Weapons.mp3",
        },
    ]

    for song_data in songs:
        existing_song = Song.query.filter_by(name=song_data["name"], album_id=isolate_and_medicate.id).first()

        if not existing_song:
            new_song = Song(
                name=song_data["name"],
                url=song_data["url"],
                album=isolate_and_medicate,
                artist=seether,
                genre=genre_rock,
            )
            db.session.add(new_song)

    db.session.commit()


def undo_seether():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM artists"))
        db.session.execute(text("DELETE FROM songs"))
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()
