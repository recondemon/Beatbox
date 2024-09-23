from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre


def seed_rascal_flatts():
    rascal_flatts = Artist.query.filter_by(band_name="Rascal Flatts").first()

    if not rascal_flatts:
        rascal_flatts = Artist(
            band_name="Rascal Flatts",
            email="garyl@google.com",
            password="password",
            first_name="Gary",
            last_name="LeVox",
            bio="Rascal Flatts is an American country music group formed in 1999. The band’s lineup includes Gary LeVox \(lead vocals\), Jay DeMarcus \(bass guitar\), and Joe Don Rooney \(lead guitar\). Known for their smooth harmonies and crossover appeal, Rascal Flatts achieved massive success with hits like 'Bless the Broken Road' and 'What Hurts the Most.' Over their career, they became one of the best-selling country groups of all time, with numerous awards and chart-topping albums."
        )
        db.session.add(rascal_flatts)

    genre_country = Genre.query.filter_by(name="Country").first()

    if not genre_country:
        genre_country = Genre(name="Country")
        db.session.add(genre_country)

    me_and_my_gang = Album.query.filter_by(name="Me And My Gang", artist_id=rascal_flatts.id).first()

    if not me_and_my_gang:
        album_cover_url = "https://beatbox-album-art.s3.us-east-2.amazonaws.com/Rascal+Flatts/Me+And+My+Gang/Me+And+My+Gang.jpg"
        me_and_my_gang = Album(
            name="Me And My Gang",
            description="Me and My Gang is the fourth studio album by American country music group Rascal Flatts, released in 2006. The album features a mix of country and pop, with catchy melodies and heartfelt lyrics.",
            release_date=datetime(2006, 4, 4),
            artist=rascal_flatts,
            album_cover=album_cover_url,
        )
        db.session.add(me_and_my_gang)

    songs = [
        {
            "name": "Life is a Highway",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Rascal+Flatts/Me+And+My+Gang/Life+is+a+Highway.mp3",
        },
        {
            "name": "My Wish",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Rascal+Flatts/Me+And+My+Gang/My+Wish.mp3",
        },
        {
            "name": "What Hurts the Most",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Rascal+Flatts/Me+And+My+Gang/What+Hurts+The+Most.mp3",
        },
        {
            "name": "Me And My Gang",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Rascal+Flatts/Me+And+My+Gang/Me+And+My+Gang.mp3",
        },
        {
            "name": "Backwards",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Rascal+Flatts/Me+And+My+Gang/Backwards.mp3",
        },
    ]

    for song_data in songs:
        existing_song = Song.query.filter_by(name=song_data["name"], album_id=me_and_my_gang.id).first()

        if not existing_song:
            new_song = Song(
                name=song_data["name"],
                url=song_data["url"],
                album=me_and_my_gang,
                artist=rascal_flatts,
                genre=genre_country,
            )
            db.session.add(new_song)

    db.session.commit()


def undo_rascal_flatts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM artists"))
        db.session.execute(text("DELETE FROM songs"))
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()
