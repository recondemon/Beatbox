from flask import Blueprint, request, jsonify
from app.models import Models, db
from flask_login import current_user, login_user, logout_user, login_required
from app.api.aws_upload import get_unique_filename, upload_file_to_s3
from app.forms.song_form import SongForm

Genre = Models.Genre
genres = Blueprint("genres", __name__)


@genres.route("/")
def all_genre():
    Genres = Genre.query.all()
    return jsonify([genre.to_json() for genre in Genres])
