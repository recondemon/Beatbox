from flask import Blueprint, request, jsonify
from app.models import Models, db
from flask_login import current_user, login_required
from app.forms.album_form import AlbumForm
from app.api.aws_upload import upload_file_to_s3, get_unique_filename, remove_file_from_s3

Album = Models.Album

albums = Blueprint("albums", __name__)


# get all albums
@albums.route("/")
def all_albums():
    albums = Album.query.all()
    return [album.to_json() for album in albums]


# get an album by album id
@albums.route("/<int:album_id>")
def album(album_id):
    album = Album.query.get(album_id)
    if not album:
        return jsonify({"error": "Album not found"}), 404
    return album.to_json()


# get all albums by user id
@albums.route("/user/<int:user_id>")
@login_required
def user_albums(user_id):
    albums = Album.query.filter_by(artist_id=user_id).all()
    return [album.to_json() for album in albums]


# create an album, POST method
@albums.route("/", methods=["POST"])
@login_required
def create_album():
    form = AlbumForm()

    if form.validate_on_submit():
        new_album = Album()
        form.populate_obj(new_album)
        new_album.album_cover = upload_file_to_s3(form.data["file"])
        new_album.artist_id = current_user.id
        db.session.add(new_album)
        db.session.commit()
        return new_album.to_json(), 201

    return jsonify({"error": "Bad Data"}), 400


# edit an album
@albums.route("/<int:album_id>", methods=["PUT"])
@login_required
def update_album(album_id):
    album = Album.query.get(album_id)
    if not album:
        return jsonify({"error": "Album not found"}), 404
    if album.artist_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    form = AlbumForm()

    if form.validate_on_submit():
        form.populate_obj(album)
        remove_file_from_s3(album.album_cover)
        album.album_cover = upload_file_to_s3(form.data["file"])
        db.session.commit()
        return album.to_json()

    return jsonify({"error": "Bad Data"}), 400


# delete an album
@albums.route("/<int:album_id>", methods=["DELETE"])
@login_required
def delete_album(album_id):
    album = Album.query.get(album_id)
    if not album:
        return jsonify({"error": "Album not found"}), 404
    if album.artist_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(album)
    db.session.commit()
    return jsonify({"message": "Album deleted successfully"}), 200
