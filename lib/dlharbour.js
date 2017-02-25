var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var jsdom = require('jsdom');
var fs = require("fs");
var jquery = fs.readFileSync("./bower_components/jquery/dist/jquery.js", "utf-8");
var out=[];

var parseData = function(posts) {

  for (var i = 9; i < 68; i++) {
    var post = posts[i].split('\n');
    // console.log('POST    ', i, post);
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


var parseTemp = function(posts) {

  var j = 0;
  for (var i = 9; i < 68; i++) {
    var post = posts[i].split('\n');
    out[j].temp = post[2]
    // console.log('i ',i,j, out[j])
    j++
  }

  
  for (var i = 68; i < posts.length; i=i+10) {
    var post = posts[i].split('\n');
    out[j].temp = post[2];
    if(j>out.length) break;
    j++;
  }

  return posts;
}

var addTemp = function(res) {
  jsdom.env({
    url: "http://www.dlhweather.com/6hr-wind-graph/6hr-temperature-graph/6hr-temperature-data/",
    src: [jquery],
    done: function (errors, window) {
      if(window){
        var $ = window.$, // Alias JQUery
        posts = [];
        // console.log('window222  ', window );
        $('.entry-content table tr').each(function(index, item){
          item = $(item); // make queryable in JQ
          posts.push(item.text().trim())
        });
        // console.log('temptemptemp ',JSON.stringify(posts))   ;
        parseTemp(posts);
        // console.log('ehey hey hey ',JSON.stringify(out))   ;
        res.json({res: out});
      } else {
        console.log('error from dlHarbour ',errors)
        res.json({error: 'feck '});
      }
    }
  });
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
  dlData.get('/current', function(req, res) {


    console.log(new Date(), 'In dlData current route POST / req.body=', req.body);
    out=[];
    jsdom.env({
      url: "http://www.dlhweather.com/current-details/",
      src: [jquery],
      done: function (errors, window) {
        if(window){
          var $ = window.$, // Alias JQUery
          posts = [];
          $('.entry-content table tr').each(function(index, item){
            item = $(item); // make queryable in JQ
            posts.push(item.text().trim())
          });
          // parseData(posts);
          // addTemp(res);
          res.json({res: posts});
        } else {
          console.log('error from dlHarbour ',errors)
          res.json({error: 'feck'});
        }
      }
    });

    // see http://expressjs.com/4x/api.html#res.json
    
  });


  dlData.get('/wind', function(req, res) {


    console.log(new Date(), 'In dlData data route POST / req.body=', req.body);
    out=[];
    jsdom.env({
      url: "http://www.dlhweather.com/6hr-wind-graph/6hr-wind-data/",
      src: [jquery],
      done: function (errors, window) {
        if(window){
          var $ = window.$, // Alias JQUery
          posts = [];
                     // console.log('window111  ', window );
          $('.entry-content table tr').each(function(index, item){
            item = $(item); // make queryable in JQ
            posts.push(item.text().trim())
          });
          parseData(posts);
          // console.log('ehey hey hey ',JSON.stringify(out));
          addTemp(res);
          
          // res.json({res: posts});
        } else {
          console.log('error from dlHarbour ',errors)
          res.json({error: 'feck'});
        }
      }
    });

    // see http://expressjs.com/4x/api.html#res.json
    
  });





  return dlData;
}



module.exports = dlDataRoute;
