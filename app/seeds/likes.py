from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Artist = Models.Artist  # pyright: ignore
Song = Models.Song  # pyright: ignore
Like = Models.Like  # pyright: ignore
Playlist = Models.Playlist # pyright: ignore


def seed_likes():
    demo = Artist.query.filter_by(first_name="Demo", last_name="Lition").first()
    songs = Song.query.limit(5).all()
    liked_playlist = Playlist.query.filter_by(owner_id=demo.id, is_public=False, name="Liked").first()
    likes = []

    for song in songs:
        likes.append(Like(user_id=demo.id, song_id=song.id))
        liked_playlist.songs.append(song)

    db.session.add_all(likes)
    db.session.commit()


def undo_likes():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.likes RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM likes"))
    db.session.commit()
