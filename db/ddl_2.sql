DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tisket;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS organizations;

CREATE TABLE organizations (
   id serial4 CONSTRAINT organizations_pk PRIMARY KEY,
   name varchar NOT NULL,
   constraint organizations_uq unique (id)
);

CREATE TABLE roles (
   id serial4 CONSTRAINT roles_pk PRIMARY KEY,
   name varchar NOT NULL,
   constraint roles_uq unique (id)
);

CREATE TABLE status (
    id serial4 CONSTRAINT status_pk PRIMARY KEY,
    name varchar NOT NULL,
    constraint status_uq unique (id)
);

CREATE TABLE users (
   uid int CONSTRAINT users_pk PRIMARY KEY,
   username varchar,
   first_name varchar,
   last_name varchar,
   roles int4 CONSTRAINT user_roles_id_fk REFERENCES roles,
   organizations int4 CONSTRAINT user_organizations_id_fk REFERENCES organizations,
   last_activity timestamp WITH TIME ZONE NOT NULL,
   is_Banned boolean,
   constraint users_uq UNIQUE (uid)
);

CREATE TABLE ticket (
    id int4 CONSTRAINT ticket_pk PRIMARY KEY,
    subject varchar,
    body_message varchar NOT NULL,
    status int4 CONSTRAINT user_status_id_fk REFERENCES status,
    organizations int4 CONSTRAINT ticket_organizations_id_fk REFERENCES organizations,
    user_id int4 not null constraint ticket_user_id_fk REFERENCES users,
    constraint ticket_uq unique (id)
);

CREATE TABLE files (
   id serial4 CONSTRAINT files_pk PRIMARY KEY,
   file_name varchar NOT NULL,
   content varchar NOT NULL,
   created_user_id int4 not null constraint document_created_user_id_fk REFERENCES users,
   created_at timestamp WITH TIME ZONE NOT NULL,
   constraint files_uq unique (id)
);
