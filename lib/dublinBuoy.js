var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var _ = require('lodash');
var fs = require("fs");
var jquery = fs.readFileSync("./bower_components/jquery/dist/jquery.min.js", "utf-8");
var jsdom = require('jsdom');

function getTemp(t){
  return t.substring(t.indexOf(':')+1, t.indexOf('C')+1);
}

function getTiime(t){
  return t.substring(t.indexOf('/')-2, t.indexOf('/')+3) + t.substring(t.indexOf('/')+8, t.indexOf('/')+14);
}



var parseTweets = function(posts) {

  var out = [];
  var search = ['Avg Wind', 'Gust', 'Wind Dir', 'Wave Height', 'Wave Period', 'Water Temp']
  var text = ['Wind', 'Gust', 'Dirn', 'Height', 'Period', 'WaterTemp',  'Time']

  for (var i = 0; i < posts.length; i++) {
    var found = {};
    console.log(posts[i]);
    var post = posts[i].split(',')
    for (var j = 0; j < search.length; j++) {
      var strA
      if(search[j] !== 'Water Temp'){
        strA = (_.find(post, function(t){return t.indexOf(search[j])>=0})).split(':');
        found[text[j]] = strA.length > 1 ? strA[1] : null
      } else {
        strA = post[5];
        found[text[j]] = getTemp(strA);
        found[text[j+1]] = getTiime(strA);
      }
    }
    out.push(found)
  }

  console.log(out);
  return out;
}




function dublinBuoyRoute() {
  var dublinBuoy = new express.Router();
  dublinBuoy.use(cors());
  dublinBuoy.use(bodyParser());


  // GET REST endpoint - query params may or may not be populated
  // dublinBuoy.get('/', function(req, res) {
  //   console.log(new Date(), 'In dublinBuoy route GET / req.query=', req.query);
  //   var world = req.query && req.query.hello ? req.query.hello : 'World';

  //   // see http://expressjs.com/4x/api.html#res.json
  //   res.json({msg: 'Hello from Dublin Buoy ' + world});
  // });

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  dublinBuoy.get('/', function(req, res) {
    console.log(new Date(), 'In dublinBuoy route POST / req.body=', req.body);
    jsdom.env({
      url: "https://twitter.com/DublinBayBuoy",
      src: [jquery],
      done: function (errors, window) {
        if(window){
          var $ = window.$, // Alias JQUery
          posts = [];
          $('.js-tweet-text-container').each(function(index, item){
            item = $(item); // make queryable in JQ
            if (item.text().indexOf('Avg Wind')){
              posts.push(item.text().trim())
            }

          });
          var parsedTweets = parseTweets(posts);
          res.json({res: parsedTweets});
        } else {
          console.log('error from Buoy ',errors)
          res.json({error: 'feck'});
        }
      }
    });

    // see http://expressjs.com/4x/api.html#res.json
    
  });

  return dublinBuoy;
}



module.exports = dublinBuoyRoute;
