from flask import Blueprint, request
from app.models import Models, db
from flask_login import current_user, login_required
from app.forms.playlist_form import PlaylistForm

Playlist = Models.Playlist # pyright: ignore
PlaylistSong = Models.PlaylistSong # pyright: ignore
Song = Models.Song # pyright: ignore
playlists = Blueprint("playlists", __name__)


@playlists.route("/")
def all_playlists():
    Playlists = Playlist.query.all()
    return [ply.to_json() for ply in Playlists if ply.is_public]


@playlists.route("/my-playlists")
@login_required
def my_playlists():
    Playlists = Playlist.query.filter_by(owner_id=current_user.id).all()
    return [genre.to_json() for genre in Playlists]


@playlists.route("/<playlist_id>")
def get_playlist(playlist_id):
    playlist = Playlist.query.get(int(playlist_id))

    if not playlist:
        return {"errors": "Playlist not found"}, 404

    if not playlist.is_public and current_user.id != playlist.owner_id:
        return {"errors": "User not authorized"}, 403

    return playlist.to_json()


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

        return playlist.to_json()

    return "Bad Form Request", 400


@playlists.route("/", methods=["POST"])
def create_playlist():
    form = PlaylistForm()

    current_artist = Models.Artist.query.get(current_user.id)  # pyright: ignore

    if form.validate_on_submit():
        playlist = Playlist()
        playlist.name = getattr(
            form,
            "name",
            "My Playlist " + len(current_artist.playlists),  # pyright: ignore
        )
        playlist.description = getattr(form, "description", playlist.description)
        playlist.is_public = getattr(form, "is_public", playlist.is_public)
        playlist.owner_id = current_user.id

        db.session.add(playlist)
        db.session.commit()

        return playlist.to_json()

    return "Bad Form Request", 400


@playlists.route("/<playlist_id>/songs", methods=["POST"])
def add_playlist_songs(playlist_id):
    song_ids = request.args.get("songs")

    playlist_songs = []

    for i in range(len(song_ids)):  # pyright: ignore
        playlist_songs.append(
            PlaylistSong(
                song_index=i,
                song_id=song_ids[i],
                playlist_id=int(playlist_id),  # pyright: ignore
            )
        )

    db.session.add(playlist_songs)
    db.session.commit()

    playlist = Playlist.query.get(int(playlist_id))

    return playlist.to_json()


@playlists.route("/<playlist_id>/song", methods=["POST"])
def add_playlist_song(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    db.session.add(
        PlaylistSong(
            song_index=len(playlist.songs),
            song_id=request.args.get("song_id"),
            playlist_id=int(playlist_id),
        )
    )
    db.session.commit()

    playlist = Playlist.query.get(int(playlist_id))

    return playlist.to_json()


@playlists.route("/get_liked")
@login_required
def get_liked():
    liked = Playlist.query.filter_by(
        owner_id=current_user.id, is_public=False, name="Liked"
    ).first()

    print(current_user.id)

    if not liked:
        return {"errors": "Liked playlist not found"}, 404

    return liked.to_json()


@playlists.route("/get_queue")
@login_required
def get_queue():
    queue = Playlist.query.filter_by(
        owner_id=current_user.id, is_public=False, name="Queue"
    ).first()

    if not queue:
        return {"errors": "Could not fetch Queue"}, 404

    return queue.to_json()


@playlists.route("/get_library")
@login_required
def get_library():
    library = Playlist.query.filter_by(
        owner_id=current_user.id, is_public=False, name="Library"
    ).first()

    if not library:
        return {"errors": "Could not fetch Library"}, 404

    return library.to_json()
