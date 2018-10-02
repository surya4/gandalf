console.log("-------------------------- call --------------------------------")
let a1  = {
  item : 4
}

let abra = function(a, b) {
  return this.item + a + b;
}

console.log("a1", a1)
console.log("abra() call", abra.call(a1, 2, 5))

console.log("-------------------------- apply --------------------------------")
let arr = [2,5];
console.log("abra() apply", abra.apply(a1, arr))

console.log("-------------------------- bind --------------------------------")
let a2  = {
  item : 4
}

let abra2 = function(a, b) {
  return this.item + a + b;
}
let dabra = abra2.bind(a2);
console.log("dabra()", dabra(9, 5))
