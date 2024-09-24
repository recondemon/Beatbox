from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Artist = Models.Artist  # pyright: ignore
Song = Models.Song  # pyright: ignore
Like = Models.Like  # pyright: ignore


def seed_likes():
    print("\n\n--- SEEDING LIKES ---\n\n")
    demo = Artist.query.filter_by(first_name="Demo", last_name="Lition").first()
    songs = Song.query.limit(5).all()
    likes = []

    print("\n\n--- DEMO ---\n\n", demo)
    print("\n\n--- SONGS ---\n\n", songs)

    for song in songs:
        likes.append(Like(user_id=demo.id, song_id=song.id))

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
