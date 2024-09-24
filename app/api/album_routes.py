import os
from flask_wtf.csrf import generate_csrf
from flask import Blueprint, request, jsonify
from app.models import Models, db
from flask_login import current_user, login_required
from app.forms.album_form import AlbumForm
from app.api.aws_upload import (
    upload_file_to_s3,
    get_unique_filename,
    remove_file_from_s3,
)
from datetime import datetime

Album = Models.Album

albums = Blueprint("albums", __name__)


@albums.after_request
def inject_csrf_token(response):
    response.set_cookie(
        "csrf_token",
        generate_csrf(),
        secure=True if os.environ.get("FLASK_ENV") == "production" else False,
        samesite="Strict"
        if os.environ.get("FLASK_ENV") == "production"
        else None,
        httponly=True,
    )
    return response


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
def create_album():
    form = AlbumForm()


    # We have to manually populate form data because god hates us...
    form.name.data = request.form.get("name")
    form.description.data = request.form.get("description")
    form.release_date.data = datetime.strptime(
        request.form.get("release_date"), "%Y-%m-%d"
    ).date()
    form.artist_id.data = request.form.get("artist_id")
    form.csrf_token.data = generate_csrf()

    if form.validate():
        new_album = Album()
        new_album.name = form.data["name"]
        new_album.description = form.data["description"]
        new_album.release_date = form.data["release_date"]
        new_album.artist_id = int(form.data["artist_id"])
        # TODO: Use get_unique_filename here
        new_album.album_cover = upload_file_to_s3(form.file.data)["url"]
        db.session.add(new_album)
        db.session.commit()
        return jsonify(new_album.to_dict()), 201

    print("\n\n---FORM VALIDATION ERRORS---\n\n", form.errors)
    print()
    return jsonify({"errors": form.errors}), 400


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
