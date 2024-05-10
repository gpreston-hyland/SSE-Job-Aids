# Undeploy a Custom Extension JAR or AMP in ADP

In the ADP, deploying custom extensions is a matter of placing the files in the `data/services/content/custom` and / or the `data/services/share/custom` folder(s) and recycling the service (or to be safe the entire ADP). What happens if you want to undeploy that extension? This page will show the steps required to remove the extension without affecting the status of any other deployed extensions.

When you add extension files to the appropriate `data/services/<service>/custom` directory and recycle the service the extension file is renamed with a `.applied` suffix to denote it has been properly deployed. Simply removing the `.applied` file doesn't remove it from the deployed areas within the container, even after a restart. This is because the container startup script looks for those new, unapplied, `.jar` or `.amp` files and deploys them and renames the file.

## The Procedure

You'll need a command line on your instance to issue `./adp.py` directives.

1. Stop ADP.
    ```sh
    ./adp.py stop
    ```
1. Delete the `.applied` files from the service's `custom` directory. For example:
    ```sh
    rm data/services/content/custom/<filename>.applied
    rm data/services/share/custom/<filename>.applied
    ```
1. Destroy the `content` and/or `share` container(s). This won't destroy any of the data. **The `-c` option below is important. This will reapply any other extensions that are also deployed in the container.**
    ```sh
    ./adp.py destroy content -c
    ./adp.py destroy share -c
    ```
1. Start ADP.
    ```sh
    ./adp.py start
    ```
