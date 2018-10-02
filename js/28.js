console.log("--- function scope closure ---")
var a1 = 4;
var p1 = function () {
  var a2 = 5;
  return a1 + a2;
}

console.log("p1() ->", p1())

console.log("--- function scope closure ---")

var p2 = function (a3) {
  return function p3(a4) {
    return a4 + a3;
  }
}

var q1 = new p2(10)
var q2 = new p2(12)

console.log("q1", q1)
console.log("q2", q2)

console.log("q1(4) ->", q1(4))
console.log("q1(5) ->", q1(5))
console.log("q2(5) ->", q2(5))