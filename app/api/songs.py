from flask import Blueprint, request
from app.models import Models, db
from flask_login import current_user, login_user, logout_user, login_required

# Songs = Models.Songs
songs = Blueprint("songs", __name__)


@songs.route("/")
def all_songs():
    return {"Songs": []}
