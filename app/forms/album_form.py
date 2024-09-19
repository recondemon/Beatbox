from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, DateField, TextAreaField,SubmitField


class AlbumForm(FlaskForm):
    
    name = StringField("Album Name")
    release_date=DateField("Date")
    description=TextAreaField("Description")
    artist_id=IntegerField("Artist")
    submit=SubmitField("Create Album")