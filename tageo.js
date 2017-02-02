/**
 * Scrapes tageo site to get csv for `city`, `lat`, `lng`, `geohash`
 *
 * How to use:
 * run `npm install`
 * run `node tageo.js tageo_url_to_cities`
 */

var request = require('request');
var cheerio = require('cheerio');
var geohash = require('geo-hash');

var url = process.argv[2];

request(url, function(err, res, body) {
  if (err) {
    throw err;
  }
  $ = cheerio.load(body);
  $('.V2 tr').each(function(i) { //each table row
    if (i === 0) return; //skip headers
    var data = [];
    $(this).find('td').each(function(index, tag) {
      if (index === 0) return; //rank
      if (index === 2) return; //population
      var text = $(this).text();
      if (text.toString().trim() === '') return; //dont include ''
      data.push(text);
    });
    if (data.length === 3) { //check if coordinates exist
      data.push(geohash.encode(data[1], data[2]));
    }
    console.log(data.join(','));
  });
});
