from flask import Blueprint, request, jsonify
from app.models import Models, db
from flask_login import current_user, login_user, logout_user, login_required
from app.forms.album_form import AlbumForm

Album = Models.Album

albums = Blueprint("albums", __name__)


# get all albums
@albums.route("/")
def all_albums():
    albums = Album.query.all()

    return jsonify([album.to_json() for album in albums])


# get an album by album id 
@albums.route('/<int:album_id>')
def album(album_id):
    album = Album.query.get(album_id)

    if not album:
        return jsonify({"error": "Album not found"}), 404
    return jsonify(album.to_json())

#get all albums by user id
@albums.route('/user/<int:user_id>')
def user_albums(user_id):
    albums = Album.query.filter_by(artist_id=user_id).all()

    return jsonify([album.to_json() for album in albums])



# # create an album, POST method still need to fix :(
# @albums.route('/', methods=['POST'])
# @login_required
# def create_album():
#     form = AlbumForm()

#     if form.validate_on_submit():
#         new_album = Album()
        
#         form.populate_obj(new_album)
#         db.session.add(new_album)
#         db.session.commit()

#         return jsonify(new_album.to_json())

# # edit an album still need to fix :(
# @albums.route('/<int:album_id>',methods='PUT')
# @login_required
# def edit_album(album_id):
#     album = Album.query.get(album_id)
    
#     if not album:
#         return jsonify({"error": "Album not found"}), 404
#     if album.artist_id != current_user.id:
#         return jsonify({"error": "Unauthorized User"})
    
#     return jsonify(album.to_json())



