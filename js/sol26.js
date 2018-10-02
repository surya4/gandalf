var myMap = new Map();

var k1 = 'a string',
k2 = {},
k3 = function() {};

myMap.set(k1, "value associated with k1");
myMap.set(k2, 'value associated with k2');
myMap.set(k3, 'value associated with k3');

myMap.size;

myMap.get(k1);
myMap.get(k2);
myMap.get(k3);
myMap.get('a string');

for (var [key, value] of myMap) {
  console.log(key + ' = ' + value);
}

for (var key of myMap.keys()) {
    console.log(key);
}

for (var value of myMap.values()) {
    console.log(value);
}

for (var [key, value] of myMap.entries()) {
    console.log(key + ' = ' + value);
}

var arr = [['key1', 'value1'],['a', 'abra'], ['d', 'dabra']];
var myMap2 = new Map(arr);

myMap2.forEach(function(value, key) {
    console.log(key + ' = ' + value);
  });

  var num = [1, 4, 9];
  var roots = num.map(Math.sqrt); 
  console.log(roots);

var arr2 = [{key: 1, value: 10}, 
    {key: 2, value: 20}, 
    {key: 3, value: 30}];

var newarr = arr2.map(function(obj) { 
var rObj = {};
rObj[obj.key] = obj.value;
return rObj;
});  
console.log(newarr);

var numb2 = [1, 4, 9];
var doub = numb2.map(function(num) {
  return num * 2;
});
console.log(doub);

var map3 = Array.prototype.map;
var a1 = map3.call('Hello World', function(x) { 
  return x.charCodeAt(0); 
});
console.log(a1);


