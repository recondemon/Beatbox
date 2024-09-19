from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Playlist = Models.Playlist


def seed_playlists(users):
    demo_playlist = Playlist(
        name="Demo's Favorites",
        description="My all-time favorites",
        isPublic=True,
        owner_id=users[0].id
    )

    marnie_playlist = Playlist(
        name="Marnie's Mix", 
        description="A mix of everything", 
        isPublic=False, 
        owner_id=users[1].id
    )

    bobbie_playlist = Playlist(
        name="Bobbie's Beats", 
        description="Best beats around", 
        isPublic=True, 
        owner_id=users[2].id
    )
 
    db.session.add(demo_playlist)
    db.session.add(marnie_playlist)
    db.session.add(bobbie_playlist)

    db.session.commit()


def undo_playlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.playlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM playlists"))

    db.session.commit()

    
