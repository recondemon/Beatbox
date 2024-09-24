from flask import Blueprint, request, jsonify
from app.models import Models, db
from flask_login import current_user, login_user, logout_user, login_required
from app.api.aws_upload import get_unique_filename, upload_file_to_s3

Artist = Models.Artist

artists = Blueprint("artists", __name__)


@artists.route("/")
def all_artists():
    artists = Artist.query.all()
    return jsonify([artist.to_json() for artist in artists])


@artists.route("/<artist_id>")
def get_artist(artist_id):
    print("\n\n\n\n")
    print(artist_id)
    artist = Artist.query.get(int(artist_id))
    return artist.to_json()
    print(type(artist))
    if artist:
        print(artist.to_json())
        print("\n\n\n\n")
        return artist.to_json()
    print(type(artist))
    return {}
