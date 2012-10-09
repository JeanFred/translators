{
	"translatorID": "5c905b70-39e4-497a-9166-f1116f82f587",
	"label": "Wikimedia Commons",
	"creator": "Jean-Frédéric",
	"target": "commons.wikimedia.org",
	"minVersion": "1.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "g",
	"lastUpdated": "2012-10-09 19:30:58"
}

function detectWeb(doc, url) {
	//TODO: Handle seach restults and galleries
	if (url.indexOf("Category:") != -1){
		return "multiple";    
	} else if (url.indexOf("File:") != -1) {
		return "artwork"
	}
}

function doWeb(doc, url) {
	//TODO: Handle Information/Artwork/Book
	//TODO: Handle 
	var newItem = new Zotero.Item();
	var itemType = detectWeb(doc, url);

	if (itemType == "artwork") {
		var license = ZU.xpathText(doc, "//span[@class='licensetpl_short']");
		var description = ZU.xpathText(doc, "//span[@class='fileinfotpl_desc']");
		var title = ZU.xpathText(doc, "//h1/span").substring(5)
		var author = ZU.xpathText(doc, "//td[@id='fileinfotpl_aut']/following-sibling::*");
		var date = ZU.xpathText(doc, "//td[@id='fileinfotpl_date']/following-sibling::*//span[@class='dtstart']");
		newItem.itemType = itemType;
		newItem.title = title;
		newItem.date = date;
		newItem.rights = license;
		newItem.creators.push(ZU.cleanAuthor(author, "author"));
		newItem.complete();
	}
}