{
	"translatorID": "5c905b70-39e4-497a-9166-f1116f82f587",
	"label": "Wikimedia Commons",
	"creator": "Jean-Frédéric, Sylvain Machefert",
	"target": "commons.wikimedia.org",
	"minVersion": "1.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "g",
	"lastUpdated": "2012-11-07 18:08:33"
}

function detectWeb(doc, url) {
	// TODO: Handle seach results and galleries
	if (url.indexOf("Category:") != -1) {
		return "multiple";    
	} else if (url.indexOf("File:") != -1) {
		// TODO : be more precise to detect videos / PDF ...
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
		// TODO : how do we manage i18n when multiple descriptions ?
		var description = ZU.xpathText(doc, "//span[@class='fileinfotpl_desc']");
		var title = ZU.xpathText(doc, "//h1/span").substring(5)
		var author = ZU.xpathText(doc, "//td[@id='fileinfotpl_aut']/following-sibling::*");
		var date = ZU.xpathText(doc, "//td[@id='fileinfotpl_date']/following-sibling::*//span[@class='dtstart']");
		// This first Xpath works when on File: page but not when called from Category: page ???
//		var fileUrl = doc.location.protocol + ZU.xpathText(doc, "//div[@class='fullImageLink']/div/div/a/@href");
		var fileUrl = doc.location.protocol + ZU.xpathText(doc, "//div[@class='fullMedia']/a/@href");
		newItem.itemType = itemType;
		newItem.title = title;
		newItem.date = date;
		newItem.rights = license;
		newItem.creators.push(ZU.cleanAuthor(author, "author"));
		newItem.attachments = [{
			title: newItem.title,
			url: fileUrl
		}];
		var tags;
		if (tags = ZU.xpath(doc, "//div[@class='mw-normal-catlinks']//li/a[1]")){
			for (var tag in tags) {
				newItem.tags.push(tags[tag].textContent);
			}
		}
		var attr;
		if (attr = ZU.xpathText(doc, "//td[@class='fileinfotpl_credit']/following-sibling::*")){
		} else if (attr = ZU.xpathText(doc, "//span[@class='licensetpl_attr']")){
		} 		
		if(attr){
			newItem.notes.push({attribution: attr});
		}
		newItem.url = doc.location.href;
		newItem.complete();
	} else if (itemType == "multiple") {
		// We go through all files in a category page
		var results = ZU.xpath(doc, "//div[@class='gallerytext']/a");
		if (!results.length) {
			// TODO : manage the results list when doing a search
		} else {
			var items = new Array();
			for(var i=0, n=results.length; i<n; i++) {
				items[results[i].href] = results[i].textContent;
			}
			Zotero.selectItems(items, function (items) {
				if (!items) return true;

				var files = new Array();
				for (var i in items) {
					files.push(i);
				}
				ZU.processDocuments(files, 
					function(doc) { 
						doWeb(doc, doc.location.href)
					}
				);
			});
		}
	}
}/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://commons.wikimedia.org/wiki/Category:Ch%C3%A2teau_de_Losse",
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "http://commons.wikimedia.org/wiki/File:0-Chateau-Losse-03.jpg",
		"items": [
			{
				"itemType": "artwork",
				"creators": [
					{
						"firstName": "",
						"lastName": "Konvalink",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [
					"Château de Losse"
				],
				"seeAlso": [],
				"attachments": [
					{
						"title": "0-Chateau-Losse-03.jpg"
					}
				],
				"title": "0-Chateau-Losse-03.jpg",
				"date": "2012-09-22",
				"rights": "CC-BY-SA-3.0",
				"url": "http://commons.wikimedia.org/wiki/File:0-Chateau-Losse-03.jpg",
				"libraryCatalog": "Wikimedia Commons"
			}
		]
	},
	{
		"type": "web",
		"url": "http://commons.wikimedia.org/wiki/File:542_-_Pont_transbordeur_-_Rochefort.jpg",
		"items": [
			{
				"itemType": "artwork",
				"creators": [
					{
						"firstName": "Patrick",
						"lastName": "Despoix",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [
					"Pont transbordeur de Rochefort"
				],
				"seeAlso": [],
				"attachments": [
					{
						"title": "542 - Pont transbordeur - Rochefort.jpg",
						"url": "http://upload.wikimedia.org/wikipedia/commons/6/62/542_-_Pont_transbordeur_-_Rochefort.jpg"
					}
				],
				"title": "542 - Pont transbordeur - Rochefort.jpg",
				"date": "2009-10-11",
				"rights": "CC-BY-SA-3.0",
				"url": "http://commons.wikimedia.org/wiki/File:542_-_Pont_transbordeur_-_Rochefort.jpg",
				"libraryCatalog": "Wikimedia Commons"
			}
		]
	},
	{
		"type": "web",
		"url": "https://commons.wikimedia.org/wiki/File:Woodland_avenue_at_Cefn_Bach_-_geograph.org.uk_-_816439.jpg",
		"items": [
			{
				"itemType": "artwork",
				"creators": [
					{
						"firstName": "Graham",
						"lastName": "Horn",
						"creatorType": "author"
					}
				],
				"notes": [
					{
						"attribution": "Graham Horn"
					}
				],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Woodland avenue at Cefn Bach - geograph.org.uk - 816439.jpg",
						"url": "https://upload.wikimedia.org/wikipedia/commons/1/12/Woodland_avenue_at_Cefn_Bach_-_geograph.org.uk_-_816439.jpg"
					}
				],
				"title": "Woodland avenue at Cefn Bach - geograph.org.uk - 816439.jpg",
				"date": "2008-05-24",
				"rights": "CC-BY-SA-2.0",
				"url": "https://commons.wikimedia.org/wiki/File:Woodland_avenue_at_Cefn_Bach_-_geograph.org.uk_-_816439.jpg",
				"libraryCatalog": "Wikimedia Commons",
				"accessDate": "CURRENT_TIMESTAMP"
			}
		]
	},
	{
		"type": "web",
		"url": "http://commons.wikimedia.org/wiki/File:Maintenon_-_Chateau_03.jpg",
		"items": [
			{
				
			}
		]
	}
]
/** END TEST CASES **/