let fs = require('fs');
let jsonFile = "users.json";
// let users = require(jsonFile);


fs.readFile(jsonFile, 'utf8', function(err, data) {
    if (err) throw err;
    jsonData = JSON.parse(data);
    console.log(jsonData);
    jsonData.data[1].schedules.push("ajhdwg");
    fs.writeFile(jsonFile, JSON.stringify(jsonData), function(err) {
        if (err) throw err;
        console.log('complete');
    });
});