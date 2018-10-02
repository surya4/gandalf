// 1. function is replaved by =>

let calc = function(a, b) {
    return a * b;
}
console.log(calc(3, 4));

let calc2 = (a, b) => a * b;
console.log(calc2(3, 4));

// one argument
let calc3 = a => a * a;
console.log(calc3(3));

// no argument
let calc4 = _ => 45;
console.log(calc4());

// 2. arrow function be default creates return keyword
let calc5 = function(num) {
    return num * num;
}
console.log(calc5(3));


let calc5 = num => num * num;
console.log(calc5(3));