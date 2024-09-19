from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

Genre = Models.Genre


def seed_genres():

    genre1= Genre(name="Rock"),
    genre2= Genre(name="Pop"),
    genre3= Genre(name="Hip Hop"),
    genre4= Genre(name="Jazz"),
    genre5= Genre(name="Classical")

    db.session.add(genre1)
    db.session.add(genre2)
    db.session.add(genre3)
    db.session.add(genre4)
    db.session.add(genre5)

    db.session.commit()

def undo_genres():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.genres RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM genres"))

    db.session.commit()
