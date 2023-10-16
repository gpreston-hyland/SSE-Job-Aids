var doc = document;
var blocks = [];
var key_map = [];
var value_map = [];
var getReadyToFetchMemberNameFlag = false;

performDataExtraction();

function getValue(id, map, type) {
    var result = "";
    var b = map[id];
    if (b.relationships !== null && b.relationships.length > 0) {
        for (var y in b.relationships) {
            if (b.relationships[y].type == type) {
                if (b.relationships[y].ids !== null && b.relationships[y].ids.length > 0) {
                    for (var i in b.relationships[y].ids) {
                        var id = b.relationships[y].ids[i];
                        result += blocks[id].text + " ";
                    }
                }
            }
        }
    }
    return result;

}


function invokeUntilAvailable(renditionName) {
    var _rendition = getAISRendition();

    for (var i = 0;(_rendition == undefined || _rendition == null); i++) {
        _rendition = getAISRendition(renditionName);
        logger.info("COUNTER - " + i + " - IS RENDITION UNDEFINED ???  - " + (_rendition == undefined || _rendition == null));
        if (i == 100) {
            break;
        }
    }


    return _rendition;
}

function getAISRendition(renditionName) {
    return renditionService.getRenditionByName(doc, renditionName);
}



function performDataExtraction() {


	//var aisRendition = renditionService.getRenditionByName(doc, "cm:aiTextract");
	var aisRendition = invokeUntilAvailable("cm:aiTextract");

    if (aisRendition !== undefined && aisRendition !== null) {
        logger.info("**** RENDITION IS VERY MUCH AVAILABLE ****");

        var rdoc = search.findNode(aisRendition.nodeRef);
        if (rdoc !== null && rdoc.content !== undefined) {


            var j = JSON.parse(rdoc.content);

            // Loop all blocks and construct an array of all blocks, one with all key blocks and one with all value blocks
            if (j !== undefined && j.blocks.length > 0) {
                for (var x in j.blocks) {
                    var block = j.blocks[x];
                    blocks[block.id] = block;


                    if (block.entityTypes !== null && block.entityTypes.length > 0) {
                        if (block.entityTypes[0] == "KEY") {
                            key_map[block.id] = block;
                        }
                        if (block.entityTypes[0] == "VALUE") {
                            value_map[block.id] = block;
                        }
                    }

                    if (block.blockType == "LINE") {
                        if ((block.text.match(/Name/gi)) && (doc.properties["tx:memberName"] == "")) {
                            getReadyToFetchMemberNameFlag = true;
                            continue;
                        }

                        if (getReadyToFetchMemberNameFlag) {
                            doc.properties["tx:memberName"] = block.text;
                            getReadyToFetchMemberNameFlag = false;
                        }
                    }




                    doc.save();


                }

            }


            // Loop all key blocks, lookup the value
            for (var k in key_map) {
                var kblock = key_map[k];
                var ktext = getValue(kblock.id, key_map, "CHILD");
                var value = "";
                if (kblock.relationships !== null && kblock.relationships.length > 0) {
                    for (r in kblock.relationships) {
                        if (kblock.relationships[r].type == "VALUE") {
                            for (i in kblock.relationships[r].ids) {
                                value += getValue(kblock.relationships[r].ids[i], value_map, "CHILD") + " ";
                            }
                        }
                    }
				}

                logger.info("\nKey: " + ktext + "\nValue: " + value + "\n");

//LR 2023-01-25:  adjusted to fit ins content model	and patterns from textract output for Drivers License_KennyBania.pdf		
				if ((ktext.match(/DLN/i))) {
                    doc.properties["ins:driversLicenseNumber"] = value;
                }				
				if ((ktext.match(/EXP/i))) {
                    doc.properties["ins:expirationDate"] = value;
                }				
				if ((ktext.match(/^EYES BRN/i)) || (ktext.match(/ISS/i))) {
                    doc.properties["ins:issueDate"] = value;
                }
				if ((ktext.match(/DOB/i))) {
                    doc.properties["ins:dateOfBirth"] = value;
                }				
				if ((ktext.match(/^1\s/))) {
                    doc.properties["ins:lastName_dl"] = value;
                }
				if ((ktext.match(/^8/i))) {
                    doc.properties["ins:address"] = value;
                }
				if ((ktext.match(/^2\s/))) {
                    doc.properties["ins:firstName_dl"] = value;
                }
				
				
				
				
                }

//LR 2023-01-25: height and weight not captured in ins content model; commented out 
/*				
				if ((ktext.match(/^HGT/i))) {
                    doc.properties["id:Height"] = value;
                }
				
				if ((ktext.match(/^WGT/i))) {
                    doc.properties["id:Weight"] = value;
                }
*/

                doc.save();


            }
			if ((doc.properties["ins:firstName_dl"]) && (doc.properties["ins:lastName_dl"])) {
                    doc.properties["ins:fullName_dl"] = doc.properties["ins:firstName_dl"] + " " + doc.properties["ins:lastName_dl"];
                }
			if ((doc.properties["ins:address"])) {
					logger.info("ins:address - " + doc.properties["ins:address"]);
					var statematches = doc.properties["ins:address"].match(/\s([A-Z][A-Z])\s/);
					if (statematches) {
						logger.info("!*!*!*!* length of returned match" + statematches.length);
						doc.properties["ins:state_dl"] = statematches[0];
				}
			doc.save();
            logger.log("\n--- **** **** **** ---\n");
        }

    } else {
        logger.info("**** RENDITION IS NOT YET AVAILABLE. AIS IS WORKING ON THE DOCUMENT ****");
    }

}


/*
	Example-Code-Start
    if (ktext.match(/as shown on your income tax return/gi) || ktext.match(/as shown on your income/gi) || ktext.match(/as sahowe on your income tae retum/gi)) {
    	doc.properties["tx:name"] = value;
        logger.info("\nFound income tax returning: " + ktext + "\nValue: " + value);
    }

	if (block.text.match(/^W-9$/gi)) {
        logger.info("Found W-9 in: " + block.text);
        doc.properties["tx:docType"] = block.text;
    }

	Example-Code-End
*/
