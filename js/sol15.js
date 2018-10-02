console.log("-----------var--------------")
p1 = 4;
console.log("p1 ->", p1);

// p2; ReferenceError: p2 is not defined

var p3 = 2;
console.log("p3 ->", p3);

p3 = 3
console.log("p3 ->", p3);

function abra() {
	p3 = 4;
	console.log("p3 inside abra ->", p3);
}
abra();
console.log("p3 after abra ->", p3);

var p4 = 4;
function abra2() {
	p4 = 5;
	console.log("p4 inside abra2 ->", p4);
}
console.log("p4 after abra2 ->", p4);
abra2();

var p5 = 5;
function abra3(p5) {
	p5 = 6;
	console.log("p5 inside abra3 ->", p5);
}
console.log("p5 before abra3 ->", p5);
abra3();

function abra4() {
	var p6 = 6;
	console.log("p6 inside abra4 ->", p6);
}
// console.log("p6 before abra4 ->", p6); ReferenceError: p6 is not defined
abra4();
// console.log("p6 after abra4 ->", p6); ReferenceError: p6 is not defined

console.log("p7 before decalaring ->", p7)
var p7 = 7;

console.log("p7 after decalaring ->", p7)

function abra5() {
	console.log("p8 before decalaring inside abra5 ->", p8)
	// console.log("p9 before decalaring inside abra5 ->", p9) ReferenceError: p9 is not defined
	var p8 = 8;
	p9 = 9
	
	console.log("p8 after decalaring inside abra5 ->", p8)
	console.log("p9 after decalaring inside abra5 ->", p9)
}
abra5();

var p10 = 5;
var p11;
var p12 = 5;
var p13 = 5;
function abra6() {
	p10 = 10;
	var p11 = 11;
	var p13;
	console.log("p10 inside abra6 ->", p10);
	console.log("p11 inside abra6 ->", p11);
	console.log("p12 inside abra6 ->", p12);
	console.log("p13 inside abra6 ->", p13);
	var p12 = 12;
	p13 = 13;
}
abra6()
console.log("p11 after abra6 ->", p10);
console.log("p12 after abra6 ->", p12);
console.log("p13 after abra6 ->", p13);

function abra7() {
	console.log("p14 inside abra7 ->", p14); // undefined because of hoisting
	// console.log("p15 inside abra7 ->", p15); error as p15 not decalared
	var p14 = 14;

}
abra7();

var p15 = 15;
function abra8() {
	p15 = 30;

	function p15() {}
	
}
abra8();
console.log("p15 after abra8 ->", p15);

function abra9() {
	var p16 = 16;
	function p16() {
			return 32;
	}
	// return p16();  TypeError: p16 is not a function
}
abra9();

console.log("-----------let--------------")

let q1 = 1;
function dabr1() {
	q1 = 2;
	console.log("q1 inside dabra1 ->", q1);
}
dabr1();
console.log("q1 after dabra1 ->", q1);

let q10 = 5;
let q11;
let q12 = 5;
let q13 = 5;
function dabra2() {
	// q10 = 10; ReferenceError: q10 is not defined
	let q11 = 11;
	let q13;
	// console.log("q10 inside dabra2 ->", q10); ReferenceError: q10 is not defined
	console.log("q11 inside dabra2 ->", q11);
	console.log("q13 inside dabra2 ->", q13);
	let q10 = 10;
	let q12 = 12;
	q13 = 13;
	console.log("q13 inside dabra2 after val ->", q13);
}
dabra2()
console.log("q11 after dabra2 ->", q10);
console.log("q12 after dabra2 ->", q12);
console.log("q13 after dabra2 ->", q13);

function dabra3() {
	// console.log("q14 inside dabra3 ->", q14); // ReferenceError: q14 is not defined
	let q14 = 14;

}
dabra3();

console.log("-----------const--------------")

console.log("-----------function hoisting--------------")
// fn name declaration get hoisted at top and not implimnetation
// fn expressions in JavaScript are not hoisted
kadabra1();

function kadabra1() {
	kadabra2();
	// kadabra3(); TypeError: kadabra3 is not a function
	function kadabra2() {
		console.log("i am kadabra2")
	}

	var kadabra3 = function () {
		console.log("i am kadabra3")
	}

	console.log("typeof(kadabra3) ->", typeof(kadabra3))
}

function kadabra4(){
	function kadabra5() {
			return 3;
	}
	return kadabra5();
	function kadabra5() {
			return 8;
	}
}
console.log("kadabra4 ->", kadabra4())

console.log("kadabra6 ->", kadabra6())
function kadabra6() {
  var kadabra7 = function() {
    return 3;
  };
  return kadabra7();
  var kadabra7 = function() {
    return 8;
  };
}

