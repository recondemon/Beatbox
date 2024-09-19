from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField, IntegerField, StringField


class SongForm(FlaskForm):
    file = FileField(
        "File", validators=[FileRequired(), FileAllowed(["mp3", "aac", "ogg", "wma"])]
    )
    name = StringField("Song Name")
    genre = StringField("Genre")
    album_id = IntegerField("Album")
    submit = SubmitField("Upload Song")
