let arr = [4,78,1,34];
let x = Math.min(...arr);
let y = Math.max(...arr);
console.log(x);
console.log(y);

let z = (head, ...tail) => [...tail, head];
console.log(z(1,2,3,4));