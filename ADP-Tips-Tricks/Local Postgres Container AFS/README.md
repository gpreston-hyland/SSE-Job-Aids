# Create Local Postgres Utility Container for AFS in ADP

This project came out of collaborating with [@Zach Tomechko](https://github.com/ztomechko)
to provide a local [PostgreSQL](https://www.postgresql.org/) database for use with jobs
in [Alfresco Federation Services (AFS)](https://docs.alfresco.com/federation-services/latest/). The local database is used to track documents being migrated to Alfresco from
Amazon S3. External services will add content to an S3 bucket and place an entry in this
database. One of the fields in the database is a processed flag. The AFS job regularly
scans the database for non-processed records to migrate.

The steps in this document are designed to work with the Alfresco Demo Platform (ADP) for setting up the AFS Server described in [AFS Server](../AFS%20Server/).

>
> **NOTE:** This is a use case for AFS. You can also apply this to your regular ACS setup and do database lookup as part of ACS scripts and APS/APA workflows. Natively, APS and APA Data Models can access external databases. APA also has a PostgreSQL Database Connector for even more functionality.
>

## Prep work

1. To use the local postgres from AFS via its JDBC Connector, you need to download the PostgreSQL JDBC driver from [https://jdbc.postgresql.org/download/](https://jdbc.postgresql.org/download/).
1. Upload the jar file to your EC2 instance and then log open a terminal window to the directory containing the jdbc jar file.
1. Run the following to place the jar file into the AFS container. This assumes the container is named `adp_afs_1`.

    ```sh
    docker cp ./<name of jdbc jar file> adp_afs_1:/usr/local/tomcat/lib
    ```

1. Restart the AFS container.

    ```sh
    ./adp.py restart afs
    ```

1. *(Optional)* Download and install the DBeaver Community edition from [https://dbeaver.io/download](https://dbeaver.io/download/). This is a free database tool capable of connecting to multiple types of database.

## Postgres startup script

The standard PostgreSQL container from [Docker Hub](https://hub.docker.com/_/postgres) provides a mechanism to run SQL and Script files on container creation. We will use this to create an application user and database. We will also use this to create the initial table in the application database.

The sample startup script, [01-initdb.sh](.assets/01-initdb.sh), below is dependent on several environment variables. Two for the postgres user and password, then three for the Application DB Name & app user credentials. The values for these will be defined in the  `docker-compose.yml` service definition.

```sh
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
```

## ADP docker-compose.yml update

To allow the use of standard `./adp.py` commands and to make it part of the ADP application, we'll add the service details to the ADP's `docker-compose.yml` and add it to the ADP `config.json` service list.

1. Make a backup copy of the `docker-compose.yml` and `config.json` files in the main `adp` directory.

1. Add the following as a service in `docker-compose.yml`. Also available [here.](./assets/docker-compose.yml)

    ```yml
    mypgdb:
        image: postgres:17.0
        environment:
            - POSTGRES_USER=postgres
            - POSTGRES_PASSWORD=myPostgresPW
            - APP_DB_NAME=mydb
            - APP_DB_USER=app_mydb
            - APP_DB_PASS=app_mydb_pw
        volumes:
            - ./data/mypgdb-data/:/var/lib/postgresql/data
            - ./01-initdb.sh:/docker-entrypoint-initdb.d/01-initdb.sh
        ports:
            - 9432:5432
    ```

    In this example,

    - The service (container) will be `mypgdb`.
    - Update the environment variables to suite your needs.
    - **Externally**, your database will be accessible on port 9432. I changed this from the standard to avoid potential conflict with ACS's database which runs on the default port 5432. Placing it in the defined *open* range of ports in the Hyland Alfresco Demo account.
    - The `01-initdb.sh` script is mapped into the container for execution on initial startup.

    - The database files will be in a named docker volume in the `data/mypgdb-data` subdirectory.

        The location is important. If you make changes to the `01-initdb.sh` startup script and there is data already in that directory, postgres ***will not*** execute the script. You will need to delete all the data in the `mypgdb-data` directory first. The files and directories in there won't be owned by the `ec2-user` since they are created by docker when the volume is created. You'll need to use `sudo` ***so be careful!***

        `sudo rm -rf data/mypgdb-data/*`

1. Edit the `config.json` file to add your new service for automatic start and stop capabilities.

    ```json
        {
        "local": {
            "override": "false",
            "host": "my-ec2.somewhere.com",
            "repo_port": "80",
            "share_port": "80",
            "protocol": "http",
            "services": [
                "nginx",
                "afs",
                "dozzle",
                "mypgdb"
            ],
            "deployed_modules": []
        },
        "aws": {}
    }

    ```

    This allows normal adp commands like `./adp.py start` or `./adp.py stop mypgdb` and so forth.

## *(Optional)* Configure a connection to your database in DBeaver Community

1. Start DBeaver and create a new connection. Click as shown or right click in the Database area and select Create | Connection.

    <img src="./assets/create-dbconn.png" width="35%" />
1. Select PostgreSQL and click Next.
1. Set the Host, Database, Port, and Authentication information.

    <img src="./assets/dbconn.png" />
1. Click Test Connection.  If this is the first postgres connection you've set up, you'll need DBeaver to pull the JDBC drivers for you.

1. Click Finish.

## References

- PostgreSQL - [https://www.postgresql.org/](https://www.postgresql.org/)
- DBeaver Community [https://dbeaver.io/](https://dbeaver.io/)
