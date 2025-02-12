# Integrating with Box

There are several options for simple Box integration actions.
APS has an out-of-the-box [Publish to Box](https://support.hyland.com/r/Alfresco/Alfresco-Process-Services/24.4/Alfresco-Process-Services/Configure/Content-Systems/Box) task. This uses [Box's OAuth 2.0, client-side authentication](https://developer.box.com/guides/authentication/oauth2/with-sdk/). For other functions in and APS REST API task  or from scripts in ACS, you will need a server-side [client credentials grant](https://developer.box.com/guides/authentication/client-credentials/client-credentials-setup/) (client id / client secret).

## Prep Work

To setup the Box side, you'll need an account with capabilities to create and authorize applications. Hyland has an account for pre-sales use. To get access and to use the account you need:

1. An authenticator application (the Box account uses MFA).
1. Open an [assistance request with TSE](https://try.hyland.com/assistance-request) for the credential details.
1. Create an IS Work Order to update the policies on your workstation to allow access to box.com.
1. Configure your ADP instance for SSL. In ALF - Solutions Engineering you can use

    `./adp.py aws ec2 ssl`

     This will create a new dnsConfig for https://*originalDNS*-elb.alf....com.

    *With recent security changes, the reconfiguration will likely error out when trying to add the security groups for the new load balancer (ELB) to the EC2. Open another ticket with TSE for an assist.*

## Configure a Box Application using Oauth 2.0 for use with APS's Publish to Box

Log into [https://developer.box.com](https://developer.box.com) with the provided Box developer credentials. Then click 'Create Platform App'.

<img src="assets/createPlatformApp.png">

Select Custom App.

<img src="assets/customApp.png" width="80%">

Fill in each of the properties as needed.

<img src="assets/appProps1.png" width="50%">
<img src="assets/appProps2.png" width="50%">

Select User Authentication (OAuth 2.0). Then click Create App.

<img src="assets/authMethodOAuth.png" width="50%">

This will drop you into the Configuration tab of your new application. Scroll down to find the Client ID and Client Secret in the OAuth 2.0 Credentials Section. You'll need these later when configuring APS.

<img src="assets/oauthCredentials.png" width="50%">

Next, in the OAuth 2.0 Redirect URIs enter the SSL version of your ADP and its activiti endpoint. This corresponds to the activiti-app.properties file `box.web.redirect_uris` property (converted to https).

```properties
box.web.redirect_uris=https://${dynamic.host}/activiti-app/app/rest/integration/box/confirm-auth-request
```

<img src="assets/oauthRedirect.png" width="85%">

Under the Application Scopes section, ensure that Read all and Write all are selected, at a minimum.

<img src="assets/applicaationScopesOAuth.png" width="85%">

Now, add the CORS domains and click Save Changes.

<img src="assets/corsDomainsOAuth.png" width="50%">

Now navigate to the Admin Console. Click the 'Back to My Account' button in the lower left and the select Admin Console.

<img src="assets/backToMyAcct.png" width="45%">

<img src="assets/toAdminConsole.png" width="45%">

In the Admin Console, select Integrations then Platform Apps Manaager.

<img src="assets/toPlatformApps.png" width="50%">

Click on User Authentication Apps.

<img src="assets/toUserAuthApps.png" width="50%">

Click the Plus Sign to add a new application. Then provide the **Client ID** for your application and click Next

<img src="assets/addAppButton.png">

<img src="assets/addAppClientId.png" width="50%">

If your new application isn't automatically Enabled, click the three buttons on the right and select Enable App.

<img src="assets/enableApp.png" width="80%">

### Update the APS configuration to use the Box access

*If you made it through all of the above, the rest is simple by comparison!*

In ADP, edit the file `data/services/process/activiti-app.properties`. Uncomment and edit as shown below. *Don't forget to make the redirect uris https.*

```properties
# Box OAuth configuration
box.disabled=true

#client side User Authentication Apps
box.web.client_id=<Your client id here>
box.web.client_secret=<Your client secret here>
box.web.auth_uri=https://app.box.com/api/oauth2/authorize
box.web.token_uri=https://app.box.com/api/oauth2/token
box.web.javascript_origins=https://${dynamic.host}
box.web.redirect_uris=https://${dynamic.host}/activiti-app/app/rest/integration/box/confirm-auth-request
```

Now recycle the process container.

```shell
./adp.py restart process
```

### Authenticate to Box from APS

Login to APS. Click on Identity Management.

`https://<your ec2>/activiti-app/#/`

On the Personal tab, scroll down to the bottom and click on Box Cloud.

<img src="assets/apsBoxCloudAuth.png" width="50%">

Click Authorize.

<img src="assets/boxAuthPrompt.png" width="50%">

If all the mirrors are aligned you should see the following and then press Grant access to Box.

<img src="assets/boxGrantAccess.png" width="50%">

### Use the Publish to Box activity in a process

Create or edit a process and add a Publish to Box task to the canvas.

<img src="assets/apsPublishToBox.png" width="80%">

On the task properties, set the Box Content from one of the two options.

<img src="assets/apsBoxContent.png" width="80%">

In the Box destination property, click the Select Folder button to navigate to the destination directory in Box.

<img src="assets/apsBoxDestination.png" width="80%">

### Box as the source for an APS File Upload form control

Once Box is configured, it will also become a possible source for the Attach File control on an APS Form.

<img src="assets/apsBoxAttachFile.png" width="50%">

That looks like the following during runtime.

<img src="assets/apsBoxAttachFileView.png" width="30%">

## Configure a Client Credentials Grant authorization for other REST API calls

The box integration described above is using the standard OAuth 2.0 authorization using Box SDK's under the covers. To make generic API calls, you need to create a different type of Box Platform App which utilizes Client Credentials Grant (aka Client ID / Client Secret).

Log into [https://developer.box.com](https://developer.box.com) with the provided Box developer credentials. Then click 'Create Platform App'.

<img src="assets/createPlatformApp.png">

Select Custom App.

<img src="assets/customApp.png" width="80%">

Fill in each of the properties as needed.

<img src="assets/appProps1.png" width="50%">
<img src="assets/appProps2.png" width="50%">

Select Server Authentication (Client Credentials Grant). Then click Create App.

<img src="assets/authMethodCCG.png" width="50%">

This will drop you into the Configuration tab of your new application. Scroll down to find the Client ID and Client Secret in the OAuth 2.0 Credentials Section. You'll need these later when configuring APS.

<img src="assets/oauthCredentials.png" width="50%">

Select the desired App Access Level. This can be changed later if needed.

<img src="assets/ccgAppAccessLevel.png" width="50%">

Under the Application Scopes section, ensure that Read all and Write all are selected, at a minimum.

<img src="assets/applicaationScopesOAuth.png" width="85%">

Now, add the CORS domains and click Save Changes.

<img src="assets/corsDomainsOAuth.png" width="50%">

Now navigate to the Admin Console. Click the 'Back to My Account' button in the lower left and the select Admin Console.

<img src="assets/backToMyAcct.png" width="45%">

<img src="assets/toAdminConsole.png" width="45%">

In the Admin Console, select Integrations then Platform Apps Manaager.

<img src="assets/toPlatformApps.png" width="50%">

Click the Plus Sign to add a new application. Then provide the **Client ID** for your application and click Next

<img src="assets/addServerApp.png">

<img src="assets/addAppClientId.png" width="50%">

If your new application isn't automatically Enabled, click the three buttons on the right and select Enable App.

<img src="assets/enableApp.png" width="80%">

### REST API Call syntax

Use the Box [Reference Guide for Client Credentials Grant](https://developer.box.com/guides/authentication/client-credentials/) to guide you.

Box maintains a [Postman Collection](https://developer.box.com/sdks-and-tools/#postman-collection) you can fork for testing.

Depending on whether you need `user` or `enterprise` level access you will need either the User ID or the Enterprise ID associated with your client id and secret. These are available on the General Setting tab in the box developer screen's 'My Platform Apps'.

<img src="assets/appInfoGeneralSettings.png" width="80%">


## References and Resources

- [Box API Authentication Documentation](https://developer.box.com/guides/authentication/)
- [Alfresco Process Services Box Configuration](https://support.hyland.com/r/Alfresco/Alfresco-Process-Services/24.4/Alfresco-Process-Services/Configure/Content-Systems/Box)
- [Box Postman Collection](https://developer.box.com/sdks-and-tools/#postman-collection)
