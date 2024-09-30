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


# get all albums
@albums.route("")
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
# @albums.route("/user/<int:user_id>")
# def user_albums(user_id):
#     albums = Album.query.filter_by(artist_id=user_id).all()
#     return [album.to_json() for album in albums]

@albums.route("/user/<int:user_id>")
def user_albums(user_id):
    albums = Album.query.filter_by(artist_id=user_id).all()
    if not albums:
        return jsonify({"error": "No albums found"}), 404
    return jsonify([album.to_json() for album in albums]), 200

# create an album, POST method
@albums.route("", methods=["POST"])
def create_album():
    form_data = dict(request.form)

    bad_data = ({"errors": "BAD DATA"}, 400)

    file = request.files["file"]
    file.filename = get_unique_filename(file.filename)
    url = upload_file_to_s3(file)

    if "errors" in url.keys():
        {"errors": "BAD FILE"}, 400

    name = file.filename
    if "name" in form_data.keys():
        name = form_data["name"]
        if type(name) is not str:
            return bad_data
    description = ""
    if "description" in form_data.keys():
        description = form_data["description"]
        if type(description) is not str:
            return bad_data

    release_date = form_data["release_date"]
    if type(release_date) is not str and type(release_date) is not datetime:
        return bad_data

    album = Album(
        name=name,
        description=description,
        release_date=datetime(*[int(arg) for arg in release_date.split("-")]),
        album_cover=url["url"],
        artist_id=current_user.id,
    )

    db.session.add(album)
    db.session.commit()

    return album.to_json()

    # form = AlbumForm()

    # # We have to manually populate form data because god hates us...
    # form.name.data = request.form.get("name")
    # form.description.data = request.form.get("description")
    # form.release_date.data = datetime.strptime(
    #     request.form.get("release_date"), "%Y-%m-%d"
    # ).date()
    # form.artist_id.data = request.form.get("artist_id")
    # form.csrf_token.data = generate_csrf()

    # if form.validate_on_submit():
    #     new_album = Album()
    #     new_album.name = form.data["name"]
    #     new_album.description = form.data["description"]
    #     new_album.release_date = form.data["release_date"]
    #     new_album.artist_id = int(form.data["artist_id"])
    #     # TODO: Use get_unique_filename here
    #     new_album.album_cover = upload_file_to_s3(form.file.data)["url"]
    #     db.session.add(new_album)
    #     db.session.commit()
    #     return jsonify(new_album.to_dict()), 201

    # print("\n\n---FORM VALIDATION ERRORS---\n\n", form.errors)
    # print()
    # return jsonify({"errors": form.errors}), 400


# edit an album
# @albums.route("/<int:album_id>", methods=["PUT"])
# def update_album(album_id):
#     album = Album.query.get(int(album_id))

#     if not album:
#         return {"errors": "Album not found"}, 404

#     form_data = dict(request.form)

#     bad_data = ({"errors": "BAD DATA"}, 400)

#     if "file" in dict(request.files).keys():
#         file = request.files["file"]
#         url = upload_file_to_s3(file)
#         if "errors" in url.keys():
#             {"errors": "BAD FILE"}, 400
#         remove_file_from_s3(album.album_cover)
#         album.album_cover = url["url"]

#     name = file.filename
#     if "name" in form_data.keys():
#         name = form_data["name"]
#         if type(name) is not str:
#             return bad_data
#     description = ""
#     if "description" in form_data.keys():
#         description = form_data["description"]
#         if type(description) is not str:
#             return bad_data

#     release_date = form_data["release_date"]
#     if type(release_date) is not str and type(release_date) is not datetime:
#         return bad_data

#     album.name = name
#     album.description = description
#     album.release_date = release_date

#     db.session.commit()

#     return album.to_json()

@albums.route("/<int:album_id>", methods=["PUT"])
def update_album(album_id):
    album = Album.query.get(int(album_id))
    if not album:
        return {"errors": "Album not found"}, 404

    if request.is_json:
        form_data = request.get_json()

        name = form_data.get("name", album.name)
        description = form_data.get("description", album.description)
        release_date = form_data.get("release_date", album.release_date)

        album.name = name
        album.description = description

        try:
            album.release_date = datetime.strptime(release_date, "%Y-%m-%d")
        except ValueError:
            return {"errors": "Invalid date format. Use YYYY-MM-DD."}, 400

    elif "file" in request.files:
        file = request.files["file"]
        file.filename = get_unique_filename(file.filename)
        url = upload_file_to_s3(file)

        if "errors" in url.keys():
            return {"errors": "BAD FILE"}, 400

        remove_file_from_s3(album.album_cover)
        album.album_cover = url["url"]

    db.session.commit()

    return album.to_json()

    # album = Album.query.get(album_id)
    # if not album:
    #     return jsonify({"error": "Album not found"}), 404
    # if album.artist_id != current_user.id:
    #     return jsonify({"error": "Unauthorized"}), 403

    # form = AlbumForm()
    # form.csrf_token.data = generate_csrf()

    # if form.validate_on_submit():
    #     form.populate_obj(album)
    #     remove_file_from_s3(album.album_cover)
    #     album.album_cover = upload_file_to_s3(form.data["file"])
    #     db.session.commit()
    #     return album.to_json()

    # return jsonify({"error": "Bad Data"}), 400


# delete an album
@albums.route("/<int:album_id>", methods=["DELETE"])
@login_required
def delete_album(album_id):
    album = Album.query.get(int(album_id))
    if not album:
        return jsonify({"error": "Album not found"}), 404
    if album.artist_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(album)
    db.session.commit()
    return jsonify({"message": "Album deleted successfully"}), 200
