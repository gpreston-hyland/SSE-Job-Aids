/**
 * Recurse a folder and declare each file a record.
 */
function main()
{
	try
	{
		RM();
	}
	catch(r)
	{
		logger.log("Unable to Successfully Process Request");		
		logger.error(r);		
	}

}

function RM ()
{
	var folderID;
	
	if(document.properties["ins:accountStatus"] = "Inactive")
	{
//		var hostURL = buildURL();
//        var polNodeId = getRMPolicyNodeID();

		// var requestBody = '{"name":"' + document.name + '","nodeType":"rma:recordFolder"}';
		// logger.log(requestBody);
		//replace 3-83-184-115 with EC2 instance
		//replace 98759cd3-1c86-4cc8-bda1-4fce7d8607f1 with parent folder nodeID
//		var r = http2.post('http://ec2-3-83-184-115.compute-1.amazonaws.com/alfresco/api/-default-/public/gs/versions/1/record-categories/98759cd3-1c86-4cc8-bda1-4fce7d8607f1/children',requestBody, "","demo", "demo");
		// var r = http2.post(hostURL + '/alfresco/api/-default-/public/gs/versions/1/record-categories/' + polNodeId + '/children',requestBody, "","demo", "demo");
		// logger.log(r);
		
        var polNode = companyhome.childByNamePath('Sites/rm/documentLibrary/Personal Auto Insurance/7 Year/Policy');
        var rmFolder = polNode.createNode(document.name,"rma:recordFolder");
        

		//get created folder id
		//loop through target node to find documents in personal auto, 2023 folder
		
		//GET FOLDER ID
		// var j = JSON.parse(r);
		// logger.log("parsing");
		// for (var x in j.entry) 
		// {
		// 	logger.log(x);
		// 	if(x == "id")
		// 	{
		// 		var folderID = j.entry[x];
		// 		logger.log("Folder ID Created: " + folderID);
		// 	}
		// }
		
		

	
		
		//FIND DOCS TO DECLARE AS RECORD
        var sa = actions.create('create-record');
        sa.parameters.path = 'Personal Auto Insurance/7 Year/Policy/' + document.name;

		var childfolders = document.getChildren();
		for(var lob in childfolders)
		{
			logger.log(childfolders[lob].getName());
			if(childfolders[lob].getName() == "Personal Auto")
			{
				var years = childfolders[lob].getChildren();
				for (var year in years)
				{
					logger.log(years[year].getName());	
					var test = years[year].getChildren();
					for( var doc in test)
					{
					
						logger.log("Doc Type: " +test[doc].getType());
						logger.log("Doc ID: " +test[doc].getId());

						// var requestBody = '{}';
						
//						http2.post('http://ec2-3-83-184-115.compute-1.amazonaws.com/alfresco/api/-default-/public/gs/versions/1/files/'+ test[doc].getId() +'/declare?hideRecord=false&parentId=' + folderID,requestBody, "","demo", "demo")
						// http2.post(hostURL + '/alfresco/api/-default-/public/gs/versions/1/files/'+ test[doc].getId() +'/declare?hideRecord=false&parentId=' + folderID,requestBody, "","demo", "demo")
		
                        sa.execute(test[doc]);
                    }
					
					
				}
				
			}
			
		}
	}	

}

function buildURL() {
	//dependent on custom jar alfresco-script-root-object-1.0.0.jar from
	// https://github.com/sherrymax/acs-examples/tree/master/acs-get-alfresco-hostname

	var turl;
	var turl = sysAdmin.getAlfrescoProtocol() + '://' + sysAdmin.getAlfrescoHost();

	var port= sysAdmin.getAlfrescoPort();

	if (port != 80) {
 	 turl = turl + ':' + port;
	}
	
	return turl;
}

function getRMPolicyNodeID() {
	var rmNode = companyhome.childByNamePath('Sites/rm/documentLibrary/Personal Auto Insurance/7 Year/Policy');
    var rmNodeId = null;

    if (rmNode) { 
		// logger.log(rmNode.getNodeRef().toString());
        rmNodeId = rmNode.getNodeRef().getId();
		logger.log('RM Policy NodeId:' + rmNodeId);
	}
	else {
		logger.log("Unable to find RM Node for Policy.");
	}
    return rmNodeId;
}

main();