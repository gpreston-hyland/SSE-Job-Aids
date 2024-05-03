# ADP 23.2.1 and ADW 4.4.1

There is an issue in the ADP 23.2.1 release for `digital-workspace` (ADW).
The `app.extensions.json` isn't compatible as delivered. The following steps will extract the default version of the file from the ADP's container, which is built from the base ADW 4.4.1 image.

## The fun part

You will need a command line on your ADP system and you don't need to have ADP running while you are making the changes.

From the `adp` directory:

1. Edit the `docker-compose.yml` and locate the `digital-workspace` service.
1. Comment out the `volumes:` section.

    ```yml
     #volumes:
     #- ./data/services/digital-workspace/app.config.json:/usr/share/nginx/html/app.config.json
     #- ./data/services/digital-workspace/app.extensions.json:/usr/share/nginx/html/assets/app.extensions.json
    ```

1. Save the changes.
1. Rebuild the `digital-workspace` container.

    ```sh
    ./adp.py destroy digital-workspace ; ./adp.py start digital-workspace
    ```

1. In `data/services/digital-workspace` rename the existing `app.extensions.json` file.

    ```sh
    mv data/services/digital-workspace/app.extensions.json data/services/digital-workspace/app.extensions.adp.json
    ```

1. Extract the default version of `app.extensions.json` from the `digital-workspace` container into the `data/services/digital-workspace` folder.

    ```sh
    CID=$(docker ps -a |grep digital-workspace | awk '{print $1}'); docker cp $CID:/usr/share/nginx/html/assets/app.extensions.json ./data/services/digital-workspace
    ```

1. Edit the `docker-compose.yml` file again and uncomment the `volumes` stanza for `digital-workspace`.
1. Rebuild the `digital-workspace` container again.

    ```sh
    ./adp.py destroy digital-workspace ; ./adp.py start digital-workspace
    ```

1. If necessary start ADP - `./adp.py start`
1. Clear the browsing data in your browser and close all windows / tabs connected to your instance.
1. Browse back to the instance and test. You should see all the columns in search results now.
