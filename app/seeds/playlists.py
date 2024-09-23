from datetime import datetime
from flask import Flask
from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Song = Models.Song
Album = Models.Album
Artist = Models.Artist
Genre = Models.Genre
Playlist = Models.Playlist


def seed_playlists():
    artists = Artist.query.all()
    playlists = []
    for artist in artists:
        playlists.append(
            Playlist(
                name="Liked",
                description="These are the songs you have liked",
                is_public=False,
                owner_id=artist.id,
            )
        )
        playlists.append(
            Playlist(
                name="Queue",
                description="These are the songs you have queued up to listen to",
                is_public=False,
                owner_id=artist.id,
            )
        )
        playlists.append(
            Playlist(
                name="Library",
                description="These are the songs you have added to your library",
                is_public=False,
                owner_id=artist.id,
            )
        )

    db.session.add_all(playlists)
    db.session.commit()


def undo_playlists():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlists RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM playlists"))
    db.session.commit()
