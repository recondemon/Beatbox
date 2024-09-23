from flask import Blueprint, request, jsonify
from app.models import Models, db
from flask_login import current_user, login_required
from app.forms.playlist_form import PlaylistForm

Playlist = Models.Playlist
PlaylistSong = Models.PlaylistSong
playlists = Blueprint("playlists", __name__)


@playlists.route("/")
def all_playlists():
    Playlists = Playlist.query.all()
    return jsonify([ply.to_json() for ply in Playlists if ply.is_public])


@playlists.route("/my-playlists")
@login_required
def my_playlists():
    Playlists = Playlist.query.filter_by(owner_id=current_user.id).all()
    return jsonify([genre.to_json() for genre in Playlists])


@playlists.route("/<playlist_id>")
def get_playlist(playlist_id):
    playlist = Playlist.query.get(int(playlist_id))

    if not playlist:
        return {"errors": "Playlist not found"}, 404

    if not playlist.is_public and current_user.id != playlist.owner_id:
        return {"errors": "User not authorized"}, 403

    return jsonify(playlist.to_json())


@playlists.route("/<playlist_id>", methods=["PUT"])
def edit_playlist(playlist_id):
    playlist = Playlist.query.get(int(playlist_id))

    if not playlist:
        return {"errors": "Playlist not found"}, 404

    form = PlaylistForm()

    if form.validate_on_submit():
        playlist.name = getattr(form, "name", playlist.name)
        playlist.description = getattr(form, "description", playlist.description)
        playlist.is_public = getattr(form, "is_public", playlist.is_public)

        db.session.commit()

        return jsonify(playlist.to_json())
    return "Bad Form Request", 400


@playlists.route("/", methods=["POST"])
def create_playlist():
    form = PlaylistForm()

    current_artist = Models.Artist.query.get(current_user.id)

    if form.validate_on_submit():
        playlist = Playlist()
        playlist.name = getattr(
            form, "name", "My Playlist " + len(current_artist.playlists)
        )
        playlist.description = getattr(form, "description", playlist.description)
        playlist.is_public = getattr(form, "is_public", playlist.is_public)
        playlist.owner_id = current_user.id

        db.session.add(playlist)
        db.session.commit()

        return jsonify(playlist.to_json())

    return "Bad Form Request", 400


@playlists.route("/<playlist_id>/songs", methods=["POST"])
def add_playlist_songs(playlist_id):
    song_ids = request.args.get("songs")

    playlist_songs = []

    for i in range(len(song_ids)):
        playlist_songs.append(
            PlaylistSong(
                song_index=i, song_id=song_ids[i], playlist_id=int(playlist_id)
            )
        )

    db.session.add(playlist_songs)
    db.session.commit()

    playlist = Playlist.query.get(int(playlist_id))

    return jsonify(playlist.to_json())
