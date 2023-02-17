# Alfresco Content Package (ACP) Files

Alfresco Content Package (ACP) files are a mechanism to copy portions of an Alfresco Respository (from single nodes to entire directory structures) to a different location in the same ACS repository or into a different ACS repository instance. The ACP file contains node information for each content node as well as folder rules.

An ACP file itself is a .zip file which contains

- an XML file containing all the metadata for each object in the ACP.
- a subdirectory containing the content elements associated with each object in the ACP.

## Creating an ACP File

