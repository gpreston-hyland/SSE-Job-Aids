# Integrating with Box

There are several options for simple Box integration actions.
APS has an out-of-the-box [Publish to Box](https://support.hyland.com/r/Alfresco/Alfresco-Process-Services/24.4/Alfresco-Process-Services/Configure/Content-Systems/Box) task. This uses [Box's OAuth 2.0, client-side authentication](https://developer.box.com/guides/authentication/oauth2/with-sdk/). For other functions in and APS REST API task  or from scripts in ACS, you will need a server-side [client credentials grant](https://developer.box.com/guides/authentication/client-credentials/client-credentials-setup/) (client id / client secret).

To setup the Box side, you'll need an account with capabilities to create and authorize applications. Hyland has an account for pre-sales use. To get access and to use the account you need:

1. An authenticator application (the Box account uses MFA).
1. Open an [assistance request with TSE](https://try.hyland.com/assistance-request) for the credential details.
1. Create an IS Work Order to update the policies on your workstation to allow access to box.com.

## Configure a Box Application using Oauth 2.0 for use with APS's Publish to Box

## Update the APS configuration to use the Box access

## Configure a Client Credentials Grant authorization for other REST API calls

## References

- [Box API Authentication Documentation](https://developer.box.com/guides/authentication/)
- [Alfresco Process Services Box Configuration](https://support.hyland.com/r/Alfresco/Alfresco-Process-Services/24.4/Alfresco-Process-Services/Configure/Content-Systems/Box)