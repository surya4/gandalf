console.log("---------------Symbols-----------------")

let a1 = Symbol('a1');
let a2 = Symbol('a1');

const b1 = 'abra ka dabra';
const b2 = 'abra ka dabra';

console.log("a1 a2 ->", a1, a2);
console.log("typeof(a1) ->", typeof(a1));
console.log("typeof(b1) ->", typeof(b1));

console.log("String comparison b1 === b2  ->", b1 === b2);
console.log("Symbol comparison a1 == a2  ->", a1 == a2);

// let a3 = new Symbol('a1'); ->  TypeError: Symbol is not a constructor
// let b3 = b1 + a1; -> TypeError: Cannot convert a Symbol value to a string

let b4 = b1 + String(a1);
console.log("b4", b4);

a1 = 'a4';
console.log("a1->", a1);

const a4  = Symbol();
const a5 = {};
a5[a4] = 'a4';
console.log("a5 ->", a5);
console.log("typeof(a5[a4]) ->", typeof(a5[a4]));

const a7  = Symbol();
const a8 = {};
a8.a7 = 'a7';
console.log("a8 ->", a8);
console.log("typeof(a8.a7) ->", typeof(a8.a7));

console.log("a5 symbols ->", Object.getOwnPropertySymbols(a5))
console.log("a8 symbols ->", Object.getOwnPropertySymbols(a8))

console.log("Symbol('a10') === Symbol('a10') ->", Symbol('a10') === Symbol('a10'))
console.log("Symbol.for('a11') === Symbol.for('a11') ->", Symbol.for('a11') == Symbol.for('a11'))

console.log("---------------boolean-----------------")

const p1 = true;
const p2 = 1;
const p3 = false;
const p4 = 0;
const p5 = "false";
const p6 = "0";
const p7 = Boolean(p4);
const p8 = Boolean(p5);
const p9 = Boolean(10);
const p10 = Boolean("abra");
const p11 = Boolean("");
const p12 = Boolean();

console.log("typeof(p1) ->", typeof(p1)) // boolean
console.log("typeof(p2) ->", typeof(p2)) // number
console.log("typeof(p3) ->", typeof(p3)) // boolean
console.log("typeof(p4) ->", typeof(p4)) // number
console.log("typeof(p5) ->", typeof(p5)) // string
console.log("typeof(p6) ->", typeof(p6)) // string
console.log("typeof(p7) ->", typeof(p7)) // boolean
console.log("typeof(p8) ->", typeof(p8)) // boolean
console.log("typeof(p11) ->", typeof(p11), p11) // boolean false
console.log("typeof(p12) ->", typeof(p12), p12) // boolean false

console.log("---------------number-----------------")

let q1 = 1;
let q2 = 0378;
let q3 = 0Xff;
let q4 = 0.44;
let q5 = -Infinity;
let q6 = +Infinity;
let q7 = +0;
let q8 = -0;
let q9 = 2/0;
let q10 = 2/-0;
let q11 = Number("2");
let q12 = Number("abra");
let q13 = Number("dabra");
console.log("q1 ->", q1, typeof(q1))
console.log("q2 ->", q2, typeof(q2))
console.log("q3 ->", q3, typeof(q3))
console.log("q4 ->", q4, typeof(q4))
console.log("q5 ->", q5, typeof(q5))
console.log("q6 ->", q6, typeof(q6))
console.log("q7 ->", q7, typeof(q7))
console.log("q8 ->", q8, typeof(q8))
console.log("q9 ->", q9, typeof(q9))
console.log("q10 ->", q10, typeof(q10))
console.log("q9 > q6 ->", q9 > q6)
console.log("q9 < q6 ->", q9 < q6)
console.log("q9 == q6 ->", q9 == q6)
console.log("q11 ->", q11, typeof(q11))  // 2
console.log("q12 typeof(NaN)->", q12, typeof(q12))  // NaN number
console.log("NaN > +Infinity ->", q12 > q6)
console.log("NaN < +Infinity ->", q12 < q6)
console.log("NaN > -Infinity ->", q12 > q5)
console.log("NaN < -Infinity ->", q12 < q5)
console.log("NaN == +Infinity ->", q12 == q6)
console.log("NaN == -Infinity ->", q12 == q5)
console.log("NaN == NaN ->", NaN == NaN)
console.log("typeof(String NaN)", String(q12), typeof(String(q12)))
console.log("typeof(Object NaN)", Object(q12), typeof(Object(q12)))
console.log("typeof(Boolean NaN)", Boolean(q12), typeof(Boolean(q12)))
console.log("typeof(Symbol NaN)", Symbol(q12), typeof(Symbol(q12)))
console.log("Number.MAX_VALUE ->", Number.MAX_VALUE) // 1.7976931348623157e+308
console.log("Number.MIN_VALUE ->", Number.MIN_VALUE) // 5e-324

console.log("--------------strings------------------")

let e1 = '';
let e2 = "";
let e3 = 'abra ka "dabra"'
console.log("e1 ->", e1, typeof(e1))
console.log("e2 ->", e2, typeof(e2))
console.log("e1 == e2 ->", e1 == e2)
console.log("e1 === e2 ->", e1 === e2)
console.log("e3 ->", e3)

console.log("---------------undefined-----------------")
// declared but not-defined / not-assigned variables

let x1;
let x2;
let x3 = "";
// let x4 = undefined("abra"); TypeError: undefined is not a function
// const x5; SyntaxError: Missing initializer in const declaration
console.log("x1 ->", typeof(x1))
console.log("typeof(typeof(x1)) ->", typeof(typeof(x1)))
console.log("x1 == x2 ->", x1 == x2)
console.log("typeof(Boolean undefined)", Boolean(undefined), typeof(Boolean(undefined)))
console.log("typeof(Number undefined)", Number(undefined), typeof(Number(undefined)))
console.log("typeof(String undefined)", String(undefined), typeof(String(undefined)))
console.log("typeof(Symbol undefined)", Symbol(undefined), typeof(Symbol(undefined)))
console.log("hello "+ x1)
console.log(2 + x1)

console.log("--------------null------------------")
// value which is non value

let m1 = null;
let m2 = "null";
let m3;
console.log("m1 ->", m1, typeof(m1))
console.log("null ->", null, typeof(null))
console.log("typeof(typeof(null)) ->", typeof(typeof(null)))
console.log("m2 ->", m2, typeof(m2))
console.log("null === m2 ->", null === m2)
console.log("null == null ->", null == null)
console.log("m3 ->", m3, typeof(m3))
console.log("null === m3 ->", null === m3)
console.log("null == m3 ->", null == m3)
console.log("typeof(Boolean null)", Boolean(null), typeof(Boolean(null)))
console.log("!null ->", !null)
console.log("!!null ->", !!null)
console.log("typeof(Number null)", Number(null), typeof(Number(null)))
console.log("typeof(Symbol null)", Symbol(null), typeof(Symbol(null)))

