// Export ACP

var nodeDestination =  companyhome.childByNamePath("User Homes/demo");

var exportAction= actions.create("export");  
exportAction.parameters['store'] = "workspace://SpacesStore";  
exportAction.parameters['destination'] = nodeDestination;  
exportAction.parameters['encoding'] = "UTF-8";  

var nodeToExport = companyhome.childByNamePath("Sites/insurance-ade/documentLibrary/Account Docs");
exportAction.parameters['package-name'] = "ins101-AccountDocs.acp";    
exportAction.parameters['include-self'] = true;  
exportAction.parameters['include-children'] = true;  
exportAction.execute(nodeToExport);  

nodeToExport = companyhome.childByNamePath("Sites/insurance-ade/documentLibrary/Email Inbox");
exportAction.parameters['package-name'] = "ins101-EmailInbox.acp";    
exportAction.parameters['include-self'] = true;  
exportAction.parameters['include-children'] = true;  
exportAction.execute(nodeToExport);   

nodeToExport = companyhome.childByNamePath("Data Dictionary/Smart Folder Templates/ins_policy.json");
exportAction.parameters['package-name'] = "ins101-smf-Template.acp";    
exportAction.parameters['include-self'] = true;  
exportAction.parameters['include-children'] = false;  
exportAction.execute(nodeToExport);  

