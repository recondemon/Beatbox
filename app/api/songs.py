from flask import Blueprint, request, jsonify
from app.models import Models, db
from flask_login import current_user, login_user, logout_user, login_required


Song = Models.Song
songs = Blueprint("songs", __name__)


@login_required
@songs.route("/")
def all_songs():
    query = Song.query

    if "genre" in request.args:
        query = query.filter(Song.genre.name == request.args["genre"])

    if "artist" in request.args:
        query = query.filter(Song.artist.name.like(f"%{request.args['artist']}%"))

    songs = query.all()
    return jsonify([song.to_json() for song in songs])
