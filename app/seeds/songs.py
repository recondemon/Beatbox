from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song

def seed_songs(albums, genres):
    demo_song = Song(
        name="Demo's Dream", 
        url="https://beatbox-bucket.s3.amazonaws.com/Piano+Sample+1+(85+BPM).m4a", 
        album_id=albums[0].id, 
        artist_id=albums[0].artist_id, 
        genre_id=genres[0].id
    )

    marnie_song = Song(
        name="Marnie's Magic", 
        url="https://beatbox-bucket.s3.amazonaws.com/Piano+Sample+1+(85+BPM).m4a",  
        album_id=albums[1].id, 
        artist_id=albums[1].artist_id, 
        genre_id=genres[1].id
    )
    
    bobbie_song = Song(
        name="Bobbie's Ballad", 
        url="https://beatbox-bucket.s3.amazonaws.com/Piano+Sample+1+(85+BPM).m4a",   
        album_id=albums[2].id, 
        artist_id=albums[2].artist_id, 
        genre_id=genres[2].id
    )

    db.session.add(demo_song)
    db.session.add(marnie_song)
    db.session.add(bobbie_song)
    db.session.commit()

def undo_songs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM songs"))

    db.session.commit()