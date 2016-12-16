var Scraper = require('image-scraper');
var scraper = new Scraper('http://alamodps.com/item_details.php?id=6128603');

scraper.scrape(function(image) { 
    image.save();
});