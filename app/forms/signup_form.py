from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Models

User = Models.Artist


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


# def username_exists(form, field):
#     # Checking if username is already in use
#     username = field.data
#     user = User.query.filter(User.username == username).first()
#     if user:
#         raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    email = StringField('email', validators=[DataRequired(), Email('Please enter a valid email'), user_exists])
    first_name = StringField('first_name', validators=[DataRequired('First name is required.')])
    last_name = StringField('last_name', validators=[DataRequired('Last name is required.')])
    band_name = StringField('band_name')
    bio = StringField('bio', validators=[DataRequired('Bio is required.')])
    password = StringField('password', validators=[DataRequired('Please enter a valid password.')])
