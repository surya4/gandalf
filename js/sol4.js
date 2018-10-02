// simple callback
getDetails('Abra', function(err, name) {
    console.log(name);
});
getDetails();

// promise
getDetails('Abra').then(function(name) {
    console.log(name);
});
getDetails();

// error handling callback
getDetails('Dabra', function(err, name) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(name);
});
getDetails();

// promise
getDetails('Dabra').then(function(name) {
    console.log(name);
}, function(err) {
    console.error(err);
    return;
});
getDetails();

// nested callbacks
getDetails('Kabra', function(err, details) {
    getLongLat(details.address, details.country, function(err, longLat) {
        getNearBy(longLat, function(err, store) {
            console.log('Your nearest store is ' + store[0]);
        });
    });
});
// promise
getDetails('Kabra').then(function(details) {
    return getLongLat(details.address, details.country);
}).then(function(longLat) {
    return getNearBy(longLat);
}).then(function(store) {
    console.log('Your nearest store is ' + store[0]);
})