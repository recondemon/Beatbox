from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import IntegerField, StringField, DateField, TextAreaField, SubmitField


class AlbumForm(FlaskForm):
    file = FileField(
        "File",
        validators=[FileRequired(), FileAllowed(["jpg", "png", "svg"])],
    )
    name = StringField("Album Name")
    release_date = DateField("Date")
    description = TextAreaField("Description")
    artist_id = IntegerField("Artist")
    submit = SubmitField("Create Album")
