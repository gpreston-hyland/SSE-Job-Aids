# Configure [Keycloak](https://www.keycloak.org/) for Alfresco Mobile Workspace

In you have deployed the identity service you need to make updates to ADP's default Keycloak configuration.

*This configuration has been tested against Alfresco Identity Services 2.0 (keycloak 21.1.2).*

## Prep Work

Download the client configuration files.
- [Android ACS](./assets/alfresco-android-acs-app.json)
- [Android APS](./assets/alfresco-android-aps-app.json)
- [iOS ACS](./assets/alfresco-ios-acs-app.json)
- [iOS APS](./assets/alfresco-ios-aps-app.json)
- [All four](./assets/Alfresco-MobileWorkspace-ClientConfigs.zip)

## Nuts and Bolts

1. Login to the Keycloak Admin tool `http://xxxxx.xxxx.com/auth/admin/`. The credentials are in the ADP documentation.
1. Select the Alfresco Realm. Then click on `Clients`

    <img src="./assets/selectRealm.png" width="35%" alt="Select Realm">

    <img alt="Clients Setup" width="35%" src="./assets/selectClients.png">

1. For each of the Client JSON File
    1. Click 'Import Client'

        <img alt="Click Import" width="35%" src="./assets/clickImport.png">
    1. Click 'Browse' and navigate to the JSON configuration file. Then click 'Save'.

        <img alt="Import File" width="80%" src="./assets/importFile.png">

The changes will be immediately available. No need to restart keycloak / the identity service container.

## Configure Mobile Workspace App

If you haven't enabled SSL on the instance or it's not using port 443 / 80, update the settings in the app accordingly.

1. Open the app on your phone / tablet. On the main screen select 'Advanced settings'.

    <img alt="advancedSettings" width="30%" src="./assets/Mobile-Workspace-1.jpg">
2. Set the HTTPS toogle and port, if needed.

    <img alt="appSettings" width="30%" src="./assets/Mobile-Workspace-2.jpg">

3. Enter just the host name or IP address in the 'Connect to' address. (leave off http/https)

# References

1. [Process Services](https://docs.alfresco.com/identity-service/latest/tutorial/sso/ldap/#step-9-optional-configure-a-mobile-client-for-process-services)
1. [Content Services](https://docs.alfresco.com/identity-service/latest/tutorial/sso/ldap/#step-10-optional-configure-a-client-for-content-services-for-ios)
