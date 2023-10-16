/*
 * check-required-docs
 * 
 * Determine if at least one instance of each of the required document types defined in the list requiredDocuments is present
 * in the ACS folder provided. This DOES NOT do a recursive search, only the immediate children of the folder.
 * 
 * Required input parameters:
 *   - claimFolder (folder)- folder to check
 * 
 * Ouput parameters:
 *   - packageComplete (boolean) : false by default. Set to true if an instance of each listed nodeType is in the folder.
 *   - missingDocuments(string)  : String version of JSON list of required document DESCRIPTIONS (not node types). 
 *                                 
*/

// list of required documents - docType names
const requiredDocuments = ["cca:lossNotice", "cca:policeReport", "cca:driversLicense", "cca:driverSchedule", "cca:drugTest"];

// Corresponding Labels for required doc types (for return)
const reqDocDescs = ["Loss Notice Form", "Police Report", "Drivers License", "Driver Schedule", "Drug Test"];

const folder = variables.claimFolder;
const nodeService = new NodeService();

//
// Get list of child nodes for the passed folder
//
console.log("**************** claimFolder:" + folder[0].id);
var docs = nodeService.listNodeChildren(folder[0].id);

console.log("**************** Found " + docs.list.entries.length + " children.");
console.log("**************** Doc Info ****************");
console.log(JSON.stringify(docs));
console.log("******************************************");

//
// Build list of node types of the returned list of folder contents
//
var folderDocs = [];
for (var i = 0; i < docs.list.entries.length; i++) {
    var x = docs.list.entries[i];
    console.log("**************** doc[" + i + "] info: " + JSON.stringify(x));
    console.log("**************** Node Type: " + x.entry.nodeType);
    folderDocs.push(x.entry.nodeType);
}
console.log("**************** DocTypes in Folder:" + folderDocs);

//
// Build missing doc types list using JSON filter funciton, basically, for each item in the required
// node types, add it to the missingDocTypes list if it isn't in the folderDocs list.
//
var missingDocTypes = requiredDocuments.filter(x => !folderDocs.includes(x));
console.log("**************** Missing " + missingDocTypes.length + " Docs:" + missingDocTypes);

//
// Check if all the required types are found.
// If not, return the string version of the list of missing DESCRIPTIONS (build from the missing node types)
//
var missingDocDescs = [];
var pkgComplete = false;

if (missingDocTypes.length == 0) {
    pkgComplete = true;
} else {
    // for each missing node type, add the corresponding description to the output list
    for (var i = 0; i < missingDocTypes.length; i++) {
        missingDocDescs.push(reqDocDescs[requiredDocuments.indexOf(missingDocTypes[i])]);
    }

}

//
// set output parameters
//
variables.packageComplete = pkgComplete;
variables.missingDocuments = JSON.stringify(missingDocDescs);

//
// Upload folder properties
//
nodeService.updateNode(folder[0].id, {
    "properties": {
        "cca:missingDocuments": variables.missingDocuments,
        "cca:packageComplete": variables.packageComplete
    }
});

//
// Log the output parameters
//
console.log("=============== Return variables ======================");
console.log("packageComplete:" + variables.packageComplete);
console.log("missingDocuments:" + variables.missingDocuments);
console.log("=======================================================");