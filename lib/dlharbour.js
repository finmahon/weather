var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');
var _ = require('lodash');
var moment = require('moment');
var jsdom = require('jsdom');
var out;

var parseData= function(posts) {

  for (var i = 9; i < 68; i++) {
    var post = posts[i].split('\n');
    out.push({
      time: post[0] + ' ' + post[1],
      wind: post[2] + ' G' + post[4],
      dirn: post[6]
    });
  }

  for (var i = 68; i < posts.length; i=i+10) {
    var post = posts[i].split('\n');
    out.push({
      time: post[0] + ' ' + post[1],
      wind: post[2] + ' G' + post[4],
      dirn: post[6]
    });
  }
}


parseTemp= function(posts) {

  var j = 0;
  for (var i = 9; i < 68; i++) {
    var post = posts[i].split('\n');
    out[j].temp = post[2]
    console.log('i ',i,j, out[j])
    j++
  }

  
  for (var i = 68; i < posts.length; i=i+10) {
    var post = posts[i].split('\n');
    out[j].temp = post[2];
    if(j>out.length) break;
    j++;
  }
}

addTemp= function(res) {
  jsdom.env(
    "http://www.dlhweather.com/6hr-wind-graph/6hr-temperature-graph/6hr-temperature-data/",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      if(window){
        var $ = window.$, // Alias JQUery
        posts = [];
        $('.entry-content table tr').each(function(index, item){
          item = $(item); // make queryable in JQ
          posts.push(item.text().trim())
        });
        parseTemp(posts);
        res.json({res: out});
      } else {
        console.log('error from dlHarbour ',errors)
        res.json({error: 'feck'});
      }
    }
  );
}



function dlDataRoute() {
  var dlData = new express.Router();
  dlData.use(cors());
  dlData.use(bodyParser());


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
  dlData.get('/', function(req, res) {
    console.log(new Date(), 'In dlData route POST / req.body=', req.body);
    var code = req.body && req.body.code ? req.body.code : 'EIDW';
    var numReadings = req.body && req.body.numReadings ? req.body.numReadings : 20;
    out=[];
    jsdom.env(
      "http://www.dlhweather.com/6hr-wind-graph/6hr-wind-data/",
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
        if(window){
          var $ = window.$, // Alias JQUery
          posts = [];
          $('.entry-content table tr').each(function(index, item){
            item = $(item); // make queryable in JQ
            posts.push(item.text().trim())
          });
          parseData(posts);
          addTemp(res);
        } else {
          console.log('error from dlHarbour ',errors)
          res.json({error: 'feck'});
        }
      }
    );

    // see http://expressjs.com/4x/api.html#res.json
    
  });

  return dlData;
}



module.exports = dlDataRoute;
