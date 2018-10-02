var x = new Array("abra",2);
x.push(94);
console.log("x", x)
console.log("x.length", x.length);

var y = new Array(10);
console.log("y", y)
console.log("y.length", y.length);

var z = [10];
console.log("z", z)
console.log("z.length", z.length);

// Output : 
// x [ 'abra', 2, 94 ]
// x.length 3
// y [ <10 empty items> ]
// y.length 10
// z [ 10 ]
// z.length 1

// Note : Object constructors don't have the same problems, but for readability and consistency object literals should be used.