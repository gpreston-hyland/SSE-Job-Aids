logger.log("*** ACP Import START ***");

var importAction = actions.create("import");  
importAction.parameters.encoding = "UTF-8";  


logger.log("** Smart Folder Template");

var targetNodeForImport = companyhome.childByNamePath("Data Dictionary/Smart Folder Templates");  
logger.log("Target: " + targetNodeForImport.getNodeRef().toString());
importAction.parameters.destination = targetNodeForImport;  
var ACPFile = companyhome.childByNamePath("User Homes/demo/ins101-smf-Template.acp");  
logger.log("Source ACP: " + ACPFile.getName());
importAction.execute(ACPFile);


logger.log("** INS-Account Space Template");

var targetNodeForImport = companyhome.childByNamePath("Data Dictionary/Space Templates");  
logger.log("Target: " + targetNodeForImport.getNodeRef().toString());
importAction.parameters.destination = targetNodeForImport; 
var ACPFile = companyhome.childByNamePath("User Homes/demo/ins101-INS-Account-SpaceTemplate.acp");  
logger.log("Source ACP: " + ACPFile.getName());
importAction.execute(ACPFile);


logger.log("** Custom Scripts");

var targetNodeForImport = companyhome.childByNamePath("Data Dictionary/Scripts");  
logger.log("Target: " + targetNodeForImport.getNodeRef().toString());
importAction.parameters.destination = targetNodeForImport; 
var ACPFile = companyhome.childByNamePath("User Homes/demo/ins101-customScripts.acp");  
logger.log("Source ACP: " + ACPFile.getName());
importAction.execute(ACPFile);


logger.log("** Solr Facets Space");

var targetNodeForImport = companyhome.childByNamePath("Data Dictionary/Solr Facets Space");  
logger.log("Target: " + targetNodeForImport.getNodeRef().toString());
importAction.parameters.destination = targetNodeForImport; 
var ACPFile = companyhome.childByNamePath("User Homes/demo/ins101-SolrFacetsSpace.acp");  
logger.log("Source ACP: " + ACPFile.getName());
importAction.execute(ACPFile);

// By default the facets will be at the bottom of the list, after the standard ones.
// Use the rest api to update to the desired order 
/* http2 amp doesn't currently support PUT :(
var req;
var baseURL = 'http://content:8080/alfresco/s/api/facet/facet-config/';
req = http2.put(baseURL + '/filter_status?relativePos=-20');
req = http2.put(baseURL + '/filter_quote_amount?relativePos=-20');
req = http2.put(baseURL + '/filter_line_of_business?relativePos=-20');
req = http2.put(baseURL + '/filter_insured_state?relativePos=-20');
req = http2.put(baseURL + '/filter_assigned_to?relativePos=-20');
req = http2.put(baseURL + '/filter_agency_name?relativePos=-20');
*/

// **
// ** Document Library
// **
logger.log("** Document Library");

targetNodeForImport = companyhome.childByNamePath("Sites/insurance-ade/documentLibrary");  
logger.log("Target: " + targetNodeForImport.getNodeRef().toString());
importAction.parameters.destination = targetNodeForImport;  

ACPFile = companyhome.childByNamePath("User Homes/demo/ins101-AccountDocs.acp");  
logger.log("Source ACP: " + ACPFile.getName());
importAction.execute(ACPFile);

ACPFile = companyhome.childByNamePath("User Homes/demo/ins101-EmailInbox.acp");  
logger.log("Source ACP: " + ACPFile.getName());
importAction.execute(ACPFile);

logger.log("** Policy Managment Smart Folder");
var smfTemplate = companyhome.childByNamePath("Data Dictionary/Smart Folder Templates/ins_policy.json");
var fldPM = targetNodeForImport.createFolder("Policy Management");
var aspProps = new Array(1);

aspProps['smf:system-template-location'] = 'N' + smfTemplate.getNodeRef();
fldPM.addAspect('smf:systemConfigSmartFolder', aspProps);
fldPM.save();

// Get Node Id's for items needed later for manual configuration
var acctTempNode = companyhome.childByNamePath("Data Dictionary/Space Templates/INS-Account");
var rmPolicyNode = companyhome.childByNamePath("Sites/rm/documentLibrary/Personal Auto Insurance/7 Year/Policy");
var acctDocsNode = targetNodeForImport = companyhome.childByNamePath("Sites/insurance-ade/documentLibrary/Account Docs");  
logger.log("-----------------------");
logger.log("  For later reference:");
logger.log("     RM File Plan Policy folder node id: " + rmPolicyNode.getId());
logger.log("     INS-Account Space Template node id: " + acctTempNode.getId());
logger.log("     Account Docs folder node id: " + acctDocsNode.getId());
logger.log("-----------------------");
logger.log("*** ACP Import COMPLETE ***");
