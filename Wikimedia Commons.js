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
	"lastUpdated": "2012-10-10 11:58:15"
}

function detectWeb(doc, url) {
	//TODO: Handle seach restults and galleries
	if (url.indexOf("Category:") != -1) {
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
}