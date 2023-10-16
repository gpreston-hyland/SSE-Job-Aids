/**
 * OOTB you can only change node type to a subtype of cm:content or cm:folder.
 * Once it's set you cannot change it to something different (e.g. with the 
 * javascript api call for specializeType()).
 * 
 * This script uses the NodeService API to issue the setType() call.
 */

// From viewpoint of ACS JavaScript console with document set to noderef.

var noderef = document.getNodeRef();
logger.log(noderef);
logger.log(document.getType());

var ctxt = Packages.org.springframework.web.context.ContextLoader.getCurrentWebApplicationContext();
//make sure to use lower case bean id for nodeService or else you will get auth errors. 
var nodeService =  ctxt.getBean('nodeService', org.alfresco.service.cmr.repository.NodeService);
var QName = Packages.org.alfresco.service.namespace.QName;

var nodeTypeContent = QName.createQName("{http://www.democo.com/model/document/Policy/1.0}mvr");
nodeService.setType(document.nodeRef, nodeTypeContent);

var d = search.findNode(noderef);
logger.log(d.getType());