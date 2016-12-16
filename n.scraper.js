"use strict"

var items = require('./items.js');

// Import the dependencies
const cheerio = require("cheerio")
    , req = require("tinyreq")
    , fs = require('fs');

// Define the scrape function
function scrape(url, data, cb) {
    // 1. Create the request
    req(url, (err, body) => {
        if (err) { return cb(err); }

        // 2. Parse the HTML
        let $ = cheerio.load(body)
          , pageData = {}
          ;

        // 3. Extract the data
        Object.keys(data).forEach(k => {
            pageData[k] = $(data[k]).text();
        });

        // Send the data in the callback
        cb(null, pageData);
    });
}

var invArr = [];

for (let i = 0; i < items.refs[i]; i++){

// Extract some data from my website
scrape(`http://alamodps.com/item_details.php?id=${items.refs[i]}`, {
    // Get the info (selector are like jQuery selectors)
    name: ".itemName"
  , period: ".itemPeriod"
  , description: ".itemDescription"
  , price: ".itemPrice"
  , condition: ".itemCondition"
  , measurements: ".itemMeasurements"
  , numOfItems: ".itemSpecifications"
}, (err, data) => {
  
    if (!data){
      console.log('No data on iteration:', i);
      return;
    }
  
    if (data.price === ''){
      return;
    }  
  
    if (err){
      console.log(err);
    }
    var widthIndex = data.measurements.indexOf('Width');
    var width = data.measurements.slice(widthIndex, widthIndex+16).split(' ')[1];
    var heightIndex = data.measurements.indexOf('Height');
    var height = data.measurements.slice(heightIndex, heightIndex+16).split(' ')[1];
    var depthIndex = data.measurements.indexOf('Depth');
    var depth = data.measurements.slice(depthIndex, depthIndex+16).split(' ')[1];
    var diameterIndex = data.measurements.indexOf('Diameter');
    var diameter = data.measurements.slice(diameterIndex, diameterIndex+16).split(' ')[1];
    if(data.numOfItems.split(' ')[3]){
      var num = data.numOfItems.split(' ')[3].split('')[0];
    }
  
    function Item(name, period, description, price, condition){
      this.name = name,
      this.period = period,
      this.description = description.split('\r')[0],
      this.price = price,
      this.condition = condition,
      this.measurements = {'width': width, 'height': height, 'depth': depth, 'diameter': diameter},
      this.numOfItems = num,
      this.imageUrl = `https://s3-us-west-1.amazonaws.com/alamod-inventory/f_${items.refs[i]}.jpg`
    }
  
 // invArr.push(new Item(data.name, data.period, data.description, data.price, data.condition));
  var obj = new Item(data.name, data.period, data.description, data.price, data.condition);
  console.log(obj)
  invArr.push(obj);

  fs.appendFile('./inv.json', JSON.stringify(obj) + ',\n');
  
});
    
}



