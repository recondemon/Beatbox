from collections.abc import Iterable
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from .db import db, environment, SCHEMA, add_prefix_for_prod

__table_args__ = ()
if environment == "production":
    __table_args__ = {"schema": SCHEMA}


class Models:
    @classmethod
    def config(cls, configs):
        if type(configs) is str:
            cls.schema_path = configs
            cls.db = db
            cls.structure = None
            cls.migrate()
            return

        config_keys = configs.keys()
        if "schema_path" in config_keys:
            cls.schema_path = configs["schema_path"]
        elif "path" in config_keys:
            cls.schema_path = configs["path"]
        else:
            cls.schema_path = None
        if "structure" in config_keys:
            cls.structure = configs["structure"]
        elif "struct" in config_keys:
            cls.structure = configs["struct"]
        elif "schema" in config_keys:
            cls.structure = configs["schema"]
        else:
            cls.structure = None
        if "db" in config_keys:
            cls.db = configs["db"]
        elif "database" in config_keys:
            cls.db = configs["database"]
        else:
            cls.db = db
        cls.migrate()


def set_schema_path(path):
    Models.schema_path = path


def set_database(db):
    Models.db = db


class JSONable:
    def attributes(self):
        return [
            key
            for key, value in self.__dict__.items()
            if not callable(value) and "instance" not in key
        ]

    # Override this method to get relationships in your to_json
    @classmethod
    def all_attributes(cls):
        return [
            [val for val in value]
            for key, value in cls.__dict__.items()
            if not callable(value)
            and isinstance(value, Iterable)
            and type(value) is not str
        ][0]

    def relationships(self):
        # return [val for val in self.all_attributes() if val not in self.attributes()]
        return self.__rels__

    # You can override this decorator to change the way the json_basic is formatted
    def json_basic(get_attributes_func):
        def to_json_basic(self):
            attributes = get_attributes_func(self)
            return {attribute: getattr(self, attribute) for attribute in attributes}

        return to_json_basic

    # You can override this decorator to change the way the json is formatted
    def json(get_relationships_func):
        def get_attr(self, relationship):
            data = getattr(self, relationship)
            if isinstance(data, Iterable):
                return data
            elif data is None:
                return []
            else:
                return [data]

        def to_json(self):
            return {
                **self.to_dict_basic(),
                **{
                    relationship: [
                        val.to_dict_basic() for val in get_attr(self, relationship)
                    ]
                    for relationship in get_relationships_func(self)
                },
            }

        return to_json

    # You can Override this as well
    @json_basic
    def to_dict_basic(self):
        attributes = self.attributes()
        attributes.append("id")  # Ensure `id` is included
        return {attribute: getattr(self, attribute) for attribute in attributes}

    # You can Override this as well
    @json
    def to_dict(self):
        return self.relationships()

    def to_json(self):
        def capitalize(string):
            if len(string) == 0:
                return ""
            if len(string) == 1:
                return string.upper()
            return string[0].upper() + string[1:]

        def to_camel_case(string):
            arr = string.split("_")
            output_arr = [arr[0]]
            for word in arr[1:]:
                output_arr.append(capitalize(word))
            return "".join(output_arr)

        dictionary = self.to_dict()
        json = {}
        for key in dictionary.keys():
            json[to_camel_case(key)] = dictionary[key]
        return json

    def to_json_basic(self):
        def to_camel_case(string):
            arr = string.split("_")
            output_arr = [arr[0]]
            for word in arr[1:]:
                output_arr.append(word.capitalize())
            return "".join(output_arr)

        dictionary = self.to_dict_basic()
        json = {}
        for key in dictionary.keys():
            json[to_camel_case(key)] = dictionary[key]
        return json

    def __repr__(self):
        attribute_string = ",\n".join(
            [
                f"{attribute}: '{getattr(self, attribute)}'"
                for attribute in self.attributes()
                if attribute != "id"
                and attribute != "created_at"
                and attribute != "updated_at"
                and attribute != "password"
            ]
        )
        return f"<{type(self).__name__} {str(self.id)}>\n{attribute_string}"


def get_models_class(db, structure) -> Models:
    Models.db = db
    Models.database_structure = structure

    def save():
        db.session.commit()

    Models.save = save

    @classmethod
    def query(cls, model_name, order_by="id", like={}, **kwargs):
        Model = getattr(cls, model_name)

        like_args = [getattr(Model, attribute).like(value) for attribute, value in like]

        if len(kwargs.keys()) == 0:
            return Model.query.order_by(getattr(Model, order_by))
        return (
            Model.query.filter_by(**kwargs)
            .order_by(getattr(Model, order_by))
            .filter(*like_args)
        )

    Models.query = query

    def add(args):
        db.session.add_all(list(args))

    Models.add = add

    @classmethod
    def create(cls, information):
        instances = []
        for key in information.keys():
            Model = getattr(cls, key)
            if (
                isinstance(information[key], Iterable)
                and type(information[key]) is not dict
            ):
                for info in information[key]:
                    instance = Model(**info)
                    instances.append(instance)
            else:
                instance = Model(**information[key])
                instances.append(instance)
        return instances

    @classmethod
    def create_add_save(cls, information):
        instances = cls.create(information)
        cls.add(instances)
        cls.save()
        return instances

    Models.create = create

    Models.create_add_save = create_add_save

    def gen_base_model_class(classname):
        def to_snake_case(CamelCase):
            output = CamelCase[0].lower()
            for char in CamelCase[1:]:
                lower = char.lower()
                if lower != char:
                    output += "_"
                output += lower
            return output

        return type(
            classname,
            (db.Model, JSONable),
            {
                "__tablename__": to_snake_case(classname) + "s",
                "id": db.Column(db.Integer, primary_key=True, autoincrement=True),
                "updated_at": db.Column(
                    db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow()
                ),
                "created_at": db.Column(db.DateTime, default=datetime.utcnow()),
                "__repr__": JSONable.__repr__,
                "__table_args__": __table_args__,
                "__rels__": [],
            },
        )

    def gen_base_auth_model_class(classname):
        def to_snake_case(CamelCase):
            output = CamelCase[0].lower()
            for char in CamelCase[1:]:
                lower = char.lower()
                if lower != char:
                    output += "_"
                output += lower
            return output

        return type(
            classname,
            (db.Model, UserMixin, JSONable),
            {
                "__tablename__": to_snake_case(classname) + "s",
                "id": db.Column(db.Integer, primary_key=True, autoincrement=True),
                "updated_at": db.Column(
                    db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow()
                ),
                "created_at": db.Column(db.DateTime, default=datetime.utcnow()),
                "__repr__": JSONable.__repr__,
                # "username": db.Column(db.String(40), nullable=False, unique=True),
                "email": db.Column(db.String(255), nullable=False, unique=True),
                "hashed_password": db.Column(db.String(255), nullable=False),
                "__table_args__": __table_args__,
                "__rels__": [],
                "password": property(
                    lambda self: self.hashed_password,  # Getter for password
                    lambda self, password: setattr(  # Setter
                        self, "hashed_password", generate_password_hash(password)
                    ),
                ),
                "check_password": lambda self, password: check_password_hash(
                    self.hashed_password, password
                ),
            },
        )

    def get_column_of_type(_type_, **kwargs):
        col_type = None
        if _type_ is str:
            col_type = db.String
        elif _type_ is int:
            col_type = db.Integer
        elif _type_ is bool:
            col_type = db.Boolean
        elif _type_ is float:
            col_type = db.Float
        return db.Column(col_type, **kwargs)

    def get_column_of_string(_string_, *args, **kwargs):
        if _string_ == "Enum":
            return db.Column(db.Enum(*args, **kwargs))
        return db.Column(getattr(db, _string_), **kwargs)

    def get_col(*args, **kwargs):
        _val_ = args[0]
        _type_ = type(_val_)
        if _type_ is type:
            return get_column_of_type(_val_, **kwargs)
        elif _type_ is str:
            return get_column_of_string(_val_, *args[1:], **kwargs)
        elif _type_ is list:
            return get_col(*_val_[0:-1], **_val_[-1])
        else:
            raise ValueError

    def get_relationship(*args):
        _length_ = len(args)

        if _length_ < 1:
            raise ValueError

        if _length_ == 1:
            return db.relationship(args[0])

        if _length_ == 2:
            return db.relationship(args[0], back_populates=args[1])

        if _length_ == 3:
            return db.relationship(
                args[0], back_populates=args[1], secondary=add_prefix_for_prod(args[2])
            )

        raise ValueError

    def populate_class(_class_, class_structure: dict, Models):
        for key in class_structure.keys():
            col_val = class_structure[key]
            if type(key) is str:
                if key == "id":
                    continue
                elif (
                    key == "relationships"
                    or key == "relationship"
                    or key == "rel"
                    or key == "rels"
                ):
                    _class_.__rels__ = _class_.__rels__ + list(col_val.keys())
                    for rel_key in col_val.keys():
                        rel_vals = col_val[rel_key]
                        _classname_ = None
                        _other_class_ = None
                        rest = []
                        if type(rel_vals is tuple):
                            _other_class_ = Models[rel_vals[0]]
                            rest = rel_vals[1:]
                        else:
                            _other_class_ = Models[rel_vals]
                        _classname_ = _other_class_.__name__
                        arguments = [_classname_, *rest]
                        other_arguments = [_class_.__name__, rel_key]
                        if len(rest) > 1:
                            other_arguments.append(rest[1])
                        setattr(_class_, rel_key, get_relationship(*arguments))
                        if len(arguments) > 1:
                            setattr(
                                _other_class_,
                                rest[0],
                                get_relationship(*other_arguments),
                            )
                            _other_class_.__rels__ = _other_class_.__rels__ + [rest[0]]
                elif key == "index" or key == "idx":
                    strings = []
                    kwargs = {}
                    for val in col_val:
                        if type(val) is str:
                            strings.append(val)
                        else:
                            kwargs = val
                    _class_.__table_args__ = (
                        *_class_.__table_args__,
                        db.Index(*strings, **kwargs),
                    )
                elif key == "indexes" or key == "idxs":
                    for args in col_val:
                        strings = []
                        kwargs = {}
                        for val in args:
                            if type(val) is str:
                                strings.append(val)
                            else:
                                kwargs = val
                        _class_.__table_args__ = (
                            *_class_.__table_args__,
                            db.Index(*strings, **kwargs),
                        )
                elif "id" in key:
                    fk = None
                    if type(col_val) is str:
                        fk = col_val.lower() + "s.id"
                    elif isinstance(col_val, Iterable):
                        fk = col_val[0].lower() + "s.id"
                    setattr(
                        _class_,
                        key,
                        db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod(fk))),
                    )
                else:
                    setattr(_class_, key, get_col(col_val))

    def populate_classes(structure):
        Models = {}
        for key in structure.keys():
            if key == "__AUTH__":
                continue
            if "__AUTH__" in structure.keys() and key == structure["__AUTH__"]:
                Models[key] = gen_base_auth_model_class(key)

            else:
                Models[key] = gen_base_model_class(key)
        for key in structure.keys():
            if key == "__AUTH__":
                continue
            populate_class(Models[key], structure[key], Models)
            setattr(Models[key], "__table_args__", tuple(Models[key].__table_args__))
        return Models

    populatedModels = populate_classes(structure)
    for Modelname in populatedModels:
        setattr(Models, Modelname, populatedModels[Modelname])

    return Models


def get_models_from_json_file(db, file_path="default"):
    import json

    path = file_path
    if file_path == "default":
        path = Models.schema_path

    with open(path, "r") as file:
        data = json.load(file)

    return get_models_class(db, data)


def create_from_schema(db, info="default"):
    if type(info) is str:
        if info == "default":
            return get_models_from_json_file(db, Models.schema_path)
        return get_models_from_json_file(db, info)
    return get_models_class(info, db)


@classmethod
def migrate(cls):
    if not cls.db:
        raise ValueError
    if cls.structure:
        return get_models_class(cls.db, cls.structure)
    elif cls.schema_path:
        return get_models_from_json_file(cls.db)
    else:
        raise ValueError


Models.migrate = migrate
