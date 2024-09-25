from flask import Blueprint, request, jsonify
from app.models import Models, db
from flask_login import current_user, login_user, logout_user, login_required
from app.api.aws_upload import (
    get_unique_filename,
    upload_file_to_s3,
    remove_file_from_s3,
)
from app.forms.song_form import SongForm

Song = Models.Song
Genre = Models.Genre
Like = Models.Like
songs = Blueprint("songs", __name__)


@songs.route("/")
def all_songs():
    query = Song.query

    query_dir = request.args.get("query")

    if query_dir and "genre" in query_dir:
        query = query.filter(Song.genre.name == query_dir["genre"])

    if query_dir and "artist" in query_dir:
        query = query.filter(Song.artist.band_name.like(f"%{query_dir['artist']}%"))

    songs = query.all()
    return jsonify([song.to_json() for song in songs])


@songs.route("/", methods=["POST"])
# @login_required
def create_song():
    print("WE MADE IT")

    form_data = dict(request.form)

    file = request.files["file"]
    url = upload_file_to_s3(file)

    if "errors" in url.keys():
        {"errors": "BAD FILE"}, 400

    genre_name = form_data["genre"]
    genre = Genre.query.filter(Genre.name == genre_name).first()
    if not genre:
        genre = Genre(name=genre_name)

    name = file.filename
    if "name" in form_data.keys():
        name = form_data["name"]

    song = Song(
        name=name,
        url=url["url"],
        genre_id=genre.id,
        artist_id=current_user.id,
        album_id=form_data["album_id"],
    )

    return song.to_json()

    # form = SongForm()

    # if form.validate_on_submit():
    #     url = upload_file_to_s3(form.file)

    #     genre_name = form.genre

    #     genre = Genre.query.filter(Genre.name == genre_name).first()

    #     if not genre:
    #         genre = Genre(name=genre_name)

    #     song = Song(
    #         name=getattr(form, "name", form.file.filename),
    #         url=url,
    #         genre_id=genre.id,
    #         artist_id=current_user.id,
    #         album_id=form.album_id,
    #     )

    #     return jsonify(song.to_json())


# @songs.route("/likes")
# def get_likes():
#     likes = Like.query.filter_by(user_id=current_user.id).all()
#     return [like.to_json() for like in likes]


@songs.route("/<song_id>", methods=["PUT"])
@login_required
def edit_song(song_id):
    song = Song.query.get(int(song_id))

    form_data = dict(request.form)

    url = form_data["url"]

    if "file" in dict(request.files).keys():
        file = request.files["file"]
        url = upload_file_to_s3(file)
        if "errors" in url:
            return {"errors": "BAD FILE"}, 400
        remove_file_from_s3(song.url)
        song.url = url

    genre_name = form_data["genre"]
    genre = Genre.query.filter(Genre.name == genre_name).first()
    if not genre:
        genre = Genre(name=genre_name)

    name = file.filename
    if "name" in form_data.keys():
        name = form_data["name"]

    song = Song(
        name=name,
        url=url["url"],
        genre_id=genre.id,
        artist_id=current_user.id,
        album_id=form_data["album_id"],
    )

    return song.to_json()

    form = SongForm()

    if form.validate_on_submit():
        url = upload_file_to_s3(form.file)

        genre_name = form.genre

        genre = Genre.query.filter(Genre.name == genre_name).first()

        if not genre:
            genre = Genre(name=genre_name)

        song = Song.query.get(song_id)
        if not song:
            return jsonify({"error": "Song not found"}), 404

        return jsonify(song.to_json())
