from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Artist = Models.Artist  # pyright: ignore
Song = Models.Song  # pyright: ignore
Like = Models.Like  # pyright: ignore


def seed_likes():
    demo = Artist.query.filter_by(id=1).first()
    songs = Song.query.limit(5).all()
    likes = []

    for song in songs:
        likes.append(Like(user_id=demo.id, song_id=song.id))

    for like in likes:
        db.session.add(like)
        db.session.commit()



def undo_likes():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.likes RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM likes"))
    db.session.commit()
