var request = require('request');
var cheerio = require('cheerio');
var geohash = require('geo-hash');

//scrapes tageo url to get `city`, `lat`, `lng`, `geohash`

var url = process.argv[2];

request(url, function(err, res, body) {
  if (err) throw err;
  $ = cheerio.load(body);
  //each row
  $('.V2 tr').each(function(i) {
    //skip headers
    if (i === 0) return;
    var data = [];
    $(this).find('td').each(function(index, tag) {
      if (index === 0) return; //rank
      if (index === 2) return; //population
      var text = $(this).text();
      if (text.toString().trim() === '') return; //empty
      data.push(text);
    });
    if (data.length === 3) data.push(geohash.encode(data[1], data[2]));
    console.log(data.join(','));
  });
});
