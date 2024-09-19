from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

Album = Models.Album
User = Models.Artist

def seed_albums():
    users = User.query.all()
    demo_album =  Album(
        name="Demo's Debut", 
        release_date=date(2022, 1, 1), 
        description="First album", 
        artist_id=users[0].id
    )

    marnie_album = Album(
        name="Marnie's Melodies", 
        release_date=date(2022, 6, 15),
        description="Sweet melodies", 
        artist_id=users[1].id
    )

    bobbie_album = Album(
        name="Bobbie's Ballads", 
        release_date=date(2023, 3, 10), 
        description="Touching ballads",
        artist_id=users[2].id
    )

    db.session.add(demo_album)
    db.session.add(marnie_album)
    db.session.add(bobbie_album)
    db.session.commit()

def undo_albums():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()