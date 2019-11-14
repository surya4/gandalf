var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

router.post('/', function(req, res, next) {
  var inp = req.body.search;

  var toVisitURL = [];
  var max = 30;
  var count = 0;
  var visitedURL = {};
  var startURL = "https://www.google.com/"+"search?q="+inp;
  var url = new URL(startURL);
  var baseUrl = url.protocol + "//" + url.hostname;
  // console.log("1");

  toVisitURL.push(startURL);
  crawl();

  function crawl(){
    // console.log(count);
    // console.log("2");
    if (count >= max) {
      console.log(count);
      console.log("Reached max limit of number of pages to visit.");
      return;
    }
    // console.log(toVisitURL);
    var next_link = toVisitURL.pop();

    if (next_link in visitedURL) {
      // console.log("1"+next_link);
      // console.log("4");
      crawl();
    } else {
      // console.log("3");
      // console.log("2"+next_link);
      
      getLinks(next_link, crawl);
    }

  }

  function getLinks(url,callback) {
    visitedURL[url] = true;
    
    count++;
    // console.log("5");
    request(url,function(err,resp,body){
      // console.log("Status code: " + resp.statusCode);
      // if(resp.statusCode !== 200) {
      //   callback();
      //   return;
      // }

      if(!err){
      // Check status code (200 is HTTP OK)
      // console.log("6");

      $ = cheerio.load(body);
      var wordFound = checkWord($,inp);
      if (wordFound) {
      //   console.log(wordFound);
      // } else {
       links = $("a[href^='http']");
      links.each(function(){
        // var new_link = link.attribs.href;
        // console.log(new_link);
        
        var new_link = $(this).attr('href');
        new_link = new_link.replace("/url?q=", "").split("&")[0];
        console.log(new_link);
        toVisitURL.push(new_link);
        
      });
    }
    crawl();
  } 
  // else {
  //     console.log("8");
  //   }
    })
  }

  function checkWord($, word) {
    // console.log("7");
    var bodyText = $('html > body').text().toLowerCase();
    return(bodyText.indexOf(word.toLowerCase()) !== -1);
    // return(bodyText.includes(inp));
  }
  // res.send("Done");
  res.send("Done");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Node Search'
    
   });
});

module.exports = router;
