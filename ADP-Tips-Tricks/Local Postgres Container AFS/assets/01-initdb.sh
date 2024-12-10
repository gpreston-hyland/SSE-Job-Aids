#!/bin/bash
set -e
# export PGPASSWORD=$POSTGRES_PASSWORD;
# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE USER $APP_DB_USER WITH PASSWORD '$APP_DB_PASS';
  CREATE DATABASE $APP_DB_NAME;
  GRANT ALL PRIVILEGES ON DATABASE $APP_DB_NAME TO $APP_DB_USER;
  ALTER DATABASE $APP_DB_NAME OWNER TO $APP_DB_USER;
  
  \connect $APP_DB_NAME $APP_DB_USER
  BEGIN;
  CREATE TABLE public.documents (
    id serial4 NOT NULL,
    doc_name varchar(255) NOT NULL,
    processed_flag bool DEFAULT false NULL,
    processed_timestamp timestamp NULL,
    CONSTRAINT documents_pkey PRIMARY KEY (id)
  );
  COMMIT;
EOSQL
