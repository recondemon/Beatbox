from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Like = Models.Like
User = Models.Artist
Song = Models.Song

def seed_likes():
    users = User.query.all()
    songs = Song.query.all()

    like1 = Like(user_id=users[0].id, song_id=songs[1].id)
    like2 = Like(user_id=users[1].id, song_id=songs[2].id)
    like3 = Like(user_id=users[2].id, song_id=songs[0].id)

    db.session.add(like1)
    db.session.add(like2)
    db.session.add(like3)

    db.session.commit()

def undo_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM likes"))

    db.session.commit()