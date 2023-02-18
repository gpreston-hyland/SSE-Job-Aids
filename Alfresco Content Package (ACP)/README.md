# Alfresco Content Package (ACP) Files

Alfresco Content Package (ACP) files are a mechanism to copy portions of an Alfresco Content Services (ACS) Respository (from single nodes to entire directory structures) to a different location in the same ACS instance or into a different ACS repository instance. The ACP file contains node information for each content node as well as folder rules.

An ACP file itself is a .zip file which contains

- an XML file containing all the metadata for each object in the ACP.
- a subdirectory containing the content elements associated with each object in the ACP.

## Creating an ACP File
The functionality for creating ACP files is native to Alfresco Content Services. There are three ways to access the functionality.

1. Via the Share UI.
1. Using the native REST API's action-definitions/export

    https://api-explorer.alfresco.com/api-explorer/#/actions

1. Using the JavaScript API.

    See the `actions` object's 'export' action.

Each of these methods will create the ACP file at a specified location in the source ACS system.

## Import Content from an ACP File