from app.models import db, Models, environment, SCHEMA
from sqlalchemy.sql import text

User = Models.Artist


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        email="demo@google.com",
        password="password",
        first_name="Demo",
        last_name="Lition",
        bio="A super fancy demo bio because we are an epic demo writting a demo bio",
    )
    demo2 = User(
        email="demo2@google.com",
        password="password",
        first_name="Demo-two",
        last_name="Litioning",
        bio="Here comes another epic bio for the second demo writting epic demo bio",
    )
    db.session.add(demo)
    db.session.add(demo2)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM artists"))

    db.session.commit()
