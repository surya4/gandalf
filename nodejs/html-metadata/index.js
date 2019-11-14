
var parseUrl = require('html-metadata'); 
var url = "http://blog.woorank.com/2013/04/dublin-core-metadata-for-seo-and-usability/";
 
parseUrl(url).then(function(metadata){
    console.log(metadata);
});
