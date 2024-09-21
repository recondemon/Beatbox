from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre

# replace "seed_artist_template" with "seed_" then artist name in snake case
def seed_beastie_boys():

    artist = Artist.query.filter_by(band_name="Beastie Boys").first()

    if not artist:
        artist = Artist(
            band_name="Beastie Boys",
            email="michaeld@google.com",
            password="password",
            first_name="Michael",
            last_name="Diamond",
            bio="Beastie Boys were an American hip hop group formed in New York City in 1981. Originally a hardcore punk band, the group eventually transitioned to hip hop and became one of the most influential rap groups in music history. The band consisted of Michael 'Mike D' Diamond, Adam 'MCA' Yauch, and Adam 'Ad-Rock' Horovitz. Known for their innovative style, humorous lyrics, and genre-bending music, the Beastie Boys achieved commercial success with albums like 'Licensed to Ill' \(1986\) and 'Paul's Boutique' \(1989\). They were inducted into the Rock and Roll Hall of Fame in 2012."
        )
        db.session.add(artist)


    genre = Genre.query.filter_by(name="Hip Hop").first()
    
    if not genre:

        genre = Genre(name="Hip Hop")
        db.session.add(genre)

    
    album = Album.query.filter_by(name="Ill Communication", artist_id=artist.id).first()

    if not album:
        #replace "ALBUM_NAME", "ALBUM_DESCRIPTION", "ALBUM_YEAR, ALBUM_MONTH, ALBUM_DAY" and add url for image
        album_cover_url = "https://beatbox-album-art.s3.us-east-2.amazonaws.com/Beastie+Boys/Ill+Communication.png"
        album = Album(
            name="Ill Communication",
            description="Ill Communication is the fourth studio album by the Beastie featuring the singles 'Sabotage' and 'Sure Shot'. The album was released in 1994 and is considered one of the group's most successful and critically acclaimed albums.",
            release_date=datetime(1994, 5, 31),
            artist=artist,
            album_cover=album_cover_url,
        )
        db.session.add(album)

    #Add song names and urls
    songs = [
        {
            "name": "Sabotage",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Beastie+Boys/Sabotage.mp3",
        },
        {
            "name": "Floot Loop",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Beastie+Boys/Flute+Loop.mp3",
        },
        {
            "name": "Root Down",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Beastie+Boys/Root+Down.mp3",
        },
        {
            "name": "Get it Together",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Beastie+Boys/Get+It+Together.mp3",
        },
        {
            "name": "SureShot",
            "url": "https://beatbox-songs.s3.us-east-2.amazonaws.com/Beastie+Boys/SureShot.mp3",
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
def undo_beastie_boys():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM artists"))
        db.session.execute(text("DELETE FROM songs"))
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()