from flask.cli import AppGroup
from .users import seed_users, undo_users
from .linkin_park import seed_linkin_park, undo_linkin_park
from .seether import seed_seether, undo_seether
from .rascal_flatts import seed_rascal_flatts, undo_rascal_flatts
from .katy_perry import seed_katy_perry, undo_katy_perry
from .limp_bizkit import seed_limp_bizkit, undo_limp_bizkit
from .beastie_boys import seed_beastie_boys, undo_beastie_boys
from .taylor_swift import seed_taylor_swift, undo_taylor_swift
from .toby_keith import seed_toby_keith, undo_toby_keith
from .playlists import seed_playlists, undo_playlists
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_linkin_park()
        undo_seether()
        undo_rascal_flatts()
        undo_katy_perry()
        undo_limp_bizkit()
        undo_beastie_boys()
        undo_taylor_swift()
        undo_toby_keith()
        undo_playlists()
    seed_users()
    seed_linkin_park()
    seed_seether()
    seed_rascal_flatts()
    seed_katy_perry()
    seed_limp_bizkit()
    seed_beastie_boys()
    seed_taylor_swift()
    seed_toby_keith()
    seed_playlists()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_rascal_flatts()
    undo_seether()
    undo_linkin_park()
    undo_katy_perry()
    undo_limp_bizkit()
    undo_beastie_boys()
    undo_taylor_swift()
    undo_toby_keith()
    undo_playlists()
    # Add other undo functions here
