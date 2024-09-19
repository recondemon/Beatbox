from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, BooleanField


class PlaylistForm(FlaskForm):
    name = StringField("Playlist Name")
    description = StringField("Describe your playlist")
    is_public = BooleanField("Will your playlist be public?")
    submit = SubmitField("Upload Song")
