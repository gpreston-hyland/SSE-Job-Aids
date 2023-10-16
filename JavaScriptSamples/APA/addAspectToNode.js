// const docid = "5c3ea3af-0407-461d-a7a6-8dec6628518a";
const docid = "50b8fcf3-7eba-4d65-b072-b138b094e2c8";
const aspect = "cca:personAspect";
const type = "cca:drugTest";

const nodeService = new NodeService();
var doc = nodeService.getNode(docid);
console.log("************* Pre-Update Node:", docid, "entry.id:", doc.entry.id, " -- ", JSON.stringify(doc));

const asList = doc.entry.aspectNames;
asList.push(aspect);

/*
 * updateNode() returns null -- js-api docs say it should return NodeEntry like getNode()
 * THAT'S NOT EXPECTED BEHAVIOR
 */
const postDoc = nodeService.updateNode(doc.entry.id, { "nodeType": type, "aspectNames": asList});
console.log("***************** PostDoc:|", postDoc,"|");