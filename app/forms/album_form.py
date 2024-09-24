from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import IntegerField, StringField, DateField


class AlbumForm(FlaskForm):
    file = FileField(
        "File",
        validators=[FileRequired(), FileAllowed(["jpg", "png", "svg"])],
    )
    name = StringField("Album Name")
    release_date = DateField("Date")
    description = StringField("Description")
    artist_id = IntegerField("Artist")

    class Meta:
        csrf = False
