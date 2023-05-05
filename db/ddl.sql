DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
    id serial4 CONSTRAINT roles_pk PRIMARY KEY,
    name varchar NOT NULL,
    constraint roles_uq unique (id)
);

CREATE TABLE users (
     uid int CONSTRAINT users_pk PRIMARY KEY,
     username varchar,
     first_name varchar,
     last_name varchar,
     roles int4 CONSTRAINT user_roles_id_fk REFERENCES roles,
     last_activity timestamp WITH TIME ZONE NOT NULL,
     constraint users_uq UNIQUE (uid)
);

CREATE TABLE tags (
    id int4 CONSTRAINT tags_pk PRIMARY KEY,
    name varchar NOT NULL,
    constraint tags_uq unique (id)
);

CREATE TABLE documents (
   id serial4 CONSTRAINT documents_pk PRIMARY KEY,
   name varchar NOT NULL,
   file_name varchar NOT NULL,
   content varchar NOT NULL,
   created_user_id int4 not null constraint document_created_user_id_fk REFERENCES users,
   change_user_id int4 constraint document_change_user_id_fk REFERENCES users,
   created_at timestamp WITH TIME ZONE NOT NULL,
   change_at timestamp WITH TIME ZONE,
   constraint documents_uq unique (id)
);
