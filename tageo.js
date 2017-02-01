/*
Copyright 2017 Gian Darren Azriel Aquino

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var request = require('request');
var cheerio = require('cheerio');
var geohash = require('geo-hash');

//scrapes tageo url to get `city`, `lat`, `lng`, `geohash`
//how to use: node tageo.js tageo_url_to_cities

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
