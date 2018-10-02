function getAllKeys(obj) {
  // your code here
var keys = [];
for (var key in obj){
  keys.push(key);
}
  console.log(keys);
}

var obj = {};
           obj[array[0]] = array[array.length-1];
           return obj;

function fromListToObject(array) {
  // your code here
  var obj = {};
  for(var i = 0; i<array.length;i++){
    obj[array[i][0]] = array[i][1];
  //  console.log(obj[array[i]]);
  }
    console.log(obj);
}




function listAllValues(obj) {
  // your code here
  var array = [];
  var counter = 0;

  for (var i in obj){
    array[ counter ] = obj[i];
    counter++;
  }
  return (array);
}

transformEmployeeData([[['firstName', 'Joe'], ['lastName', 'Blow'], ['age', 42],['role', 'clerk']],[['firstName', 'Mary'], ['lastName', 'Jenkins'], ['age', 36], ['role','manager']]]);

function transformEmployeeData(array) {
  // your code here
  var obj = [];

  for(var i in array){
    var count = array[i];
    var x = {};
    for(var j in count){
     x[array[i][j][0]] = array[i][j][1];

   }
    obj.push(x);
  }
  return obj;
}




function convertObjectToList(obj) {
  // your code here
 // var array = Object.entries(obj);
 var array = [];
 var y = 0;
 for(var i in obj){
   array.push([i,obj[i]]);
 }
  return array;
}

if (!obj.hasOwnProperty(key)){
            obj[key] = true;
        }



  if(person.age < 16){
    return false;
  }
  else {
    return true;
  }

  function addFullNameProperty(obj) {
  // your code here
  var x = obj.firstName +" "+obj.lastName;
  obj['fullName'] = obj.firstName +" "+obj.lastName;
  return obj;

  function countWords(str) {
  // your code here
  var counts = {};
  if(str.length>0){
  var arr = str.split(" ");


 // count duplicate elements from array
  for(var i=0;i<arr.length;i++){
    counts[arr[i]] = (counts[arr[i]] + 1) || 1;
  }
  }
  return counts;
}
}

function isEitherEvenAndLessThan9(num1, num2) {
  // your code here
    if (((num1%2===0) || (num2%2===0)) &&  (num1<9 && num2<9)){
    return true;
  }

  return false;
}

  for (var key in obj2){
    if(!obj1.hasOwnProperty(key)){
      obj1[key] = obj2[key];
    }
  }
  console.log(obj1);

  function removeNumbersLargerThan(num, obj) {
  // your code here
  for(var key in obj){
    if(obj[key] > num){
      delete obj[key];
    }
  }
  return obj;
}

// replace two space with one
return str.replace(/\s+/g, ' ');

    var arr = [];
    for (var elem in obj[key]) {
        if (obj[key][elem] === 10) {
            arr.push(obj[key][elem]);
        }
    }
    return arr;

    function select(arr, obj) {
  // your code here
  var obj1 = {};
  for(var i = 0; i < arr.length; i++){
 //   console.log(obj[i]);
    if(typeof obj[arr[i]] != "undefined"){
      obj1[arr[i]] = obj[arr[i]];

    }
  }
  return obj1;
}

function getElementsLessThan100AtProperty(obj, key) {
  // your code here
  var arr = [];
//  console.log(obj.key);
    for(var i in obj[key]){
    if(obj[key][i] < 100){
      arr.push(obj[key[i]);

    }
  }
//  arr.unshift();
  return arr;
}

    var arr = [];
  if((Array.isArray(obj[key])) && (typeof obj[key] !== 'undefined')){
  arr = Array.from(obj[key]);
  return arr[n];
  }

  function keep(array, keeper) {
  // your code here
  for(var i=0;i<array.length;){
    if(array[i] !== keeper){
      array.splice(i,1);
    }
    else {
      i++;
    }
  }
  return array;
}

function getOddLengthWordsAtProperty(obj, key) {
  // your code here
  var arr = [];
  if(Array.isArray(obj[key])){
  for(var i in obj[key]){
    if(obj[key][i].length%2 !== 0){
      arr.push(obj[key][i]);
    }
  }
  }
  return arr;
}

function getAverageOfElementsAtProperty(obj, key) {
  // your code here
  var avg = 0;
  if((Array.isArray(obj[key])) && (typeof obj[key] !== 'undefined') && obj[key].length > 0){
  for(var i in obj[key]){
    avg += obj[key][i];
  }
  return avg/obj[key].length;
  }
  else {
    return 0;
  }
}

function getEvenLengthWordsAtProperty(obj, key) {
  // your code here
  var arr = [];
  if((Array.isArray(obj[key])) && (typeof obj[key] !== 'undefined') && obj[key].length > 0){
  arr = Array.from(obj[key]);
  for(var i=0;i<arr.length;) {
    if(arr[i].length %2 !== 0){
      arr.splice(i,1);
    }
    else {
      i++;
    }
  }}
  return arr;
}

function filterOddLengthWords(words) {
  // your code here
  for(var i=0;i<words.length;) {
    if (words[i].length %2===0){
  //    console.log(words[i]);
      words.splice(i,1);
    }
    else {
      i++;
    }
  }
  return words;
}

function getOddElementsAtProperty(obj, key) {
  // your code here
    var arr = [];
  if((Array.isArray(obj[key])) && (typeof obj[key] !== 'undefined') && obj[key].length > 0){
  for(var i in obj[key]) {
    if(obj[key][i] %2 !== 0){
      arr.push(obj[key][i]);
   //   console.log(arr[i]);
    //  arr.splice(i,1);
    }

  }}
  return arr;
}

function filterEvenLengthWords(words) {
  // your code here
  var arr = words.filter(function(e){
    return e.length %2 ===0;
  })
  return arr;
}

function getLengthOfLongestElement(arr) {
  // your code here
  var max = 0;
  if(arr.length > 0){
  for(var i = 0; i < arr.length; i++){

    if (arr[i].length > max){
      max = arr[i].length;
    }

  }
    return max;
  }
  else {
    return 0;
  }


}

function getSmallestElementAtProperty(obj, key) {
  // your code here
  var min;
  if((Array.isArray(obj[key])) && (typeof obj[key] !== 'undefined') && obj[key].length > 0){
min = Math.min(...obj[key])

  }
return min;
}

function getLargestElementAtProperty(obj, key) {
  // your code here
  if ((typeof obj[key] != "undefined") && Array.isArray(obj[key]) && obj[key].length > 0) {
  return Math.max(...obj[key])

  }
}bc

function getAllButLastElementOfProperty(obj, key) {
  // your code here
  var arr = [];

  if ((typeof obj[key] != "undefined") && Array.isArray(obj[key]) && obj[key].length > 0) {
for (var i = 0; i < obj[key].length - 1; i++) {
            arr.push(obj[key][i]);
        }}
return arr;
}

function filterOddElements(arr) {
  // your code here
  var arr1 = arr.filter(function(e){
    return e %2 !== 0;
  })
  return arr1;
}

function computeProductOfAllElements(arr) {
  // your code here
  if (arr.length > 0){
  var mul=1;
  for (var i in arr){
    mul *= arr[i];
  }
  return mul;
  } return 0;

  function getLongestElement(arr) {
  // your code here
  var max = 0;
  var p = "";
  if (arr.length > 0) {
    for(var i in arr){
      if(arr[i].length > max){
        p = arr[i];
        max = p.length;
      }
    }

  }
  return p;
}
}

function findSmallestElement(arr) {
  // your code here
  return Math.min.apply(Math, arr);
}

function findShortestElement(arr) {
  // your code here
    var min = 0;
  var p = "";
  if (arr.length > 0) {
    min = arr[0].length;
    p = arr[0];
    for(var i in arr){
      if(arr[i].length < min){
        p = arr[i];
        min = p.length;
      }
    }

  }
  return p;
}

function getLargestElement(arr) {
  // your code here
    var max = 0;
  if (arr.length > 0) {
    max = arr[0];
    for(var i in arr){
      if(arr[i] > max){
        max = arr[i];
      }
    }

  }
  return max;
}

function computeSumOfAllElements(arr) {
  // your code here
    if (arr.length > 0){
  var sum=0;
  for (var i in arr){
    sum += arr[i];
  }
  return sum;
  } return 0;
}

function getStringLength(string) {
  // your code here
  var count = 0;
  for(var i in string){
    var c = string.charAt(i);
    count++;
  }
  return count;
}

function joinArrayOfArrays(arr) {
  // your code here
  return [].concat.apply([],arr);
}

function sumDigits(num) {
  // your code here
  var sum = 0;
  var str = num.toString();
  var i = 0;
  while(i < str.length){
 //   console.log(str[i]);
    if(str[i] != '-'){
    sum+=parseInt(str.charAt(i));
    i++;
    }
    else {
      sum+=parseInt(str.charAt(i+1)) * -1;
      i+=2;
    }
  }
  return sum;
}

function getSumOfAllElementsAtProperty(obj, key) {
  // your code here
  var sum = 0;
  if((Array.isArray(obj[key])) && (typeof obj[key] !== 'undefined') && obj[key].length > 0){
    for(var i in obj[key]){
      sum+=obj[key][i];
    }

  }
  return sum;

// findShortestWordAmongMixedElements
  var array = [1, 9, "word1", "elephant", 5, "go", 19],
    result = array.reduce(function (r, a) {
        return typeof a !== 'string' || r !== undefined && r.length < a.length ? r : a;
    }, undefined);

console.log(result);
}

function findShortestWordAmongMixedElements(arr) {
  // your code here
  var p = "findShortestWordAmongMixedElements";
  var count = 0;
  if (arr.length > 0) {
    for(var i in arr){
     if(typeof arr[i] === 'string'){
       count++;
       if(arr[i].length < p.length){
         p = arr[i];
       }
     }
    }
    if(count === 0){
      p = "";
    }

  }
  else{
    p = "";
  }
  return p;
}

function computeSummationToN(n) {
  // your code here
  var sum = 0;
  while (n>0){
    sum+=n;
    n--;
  }
  return sum;
}

function convertScoreToGrade(score) {
  // your code here
  if(score >= 90 && score <= 100){
    return 'A';
  }
  else if (score >= 80 && score <= 89){
    return 'B';
  }
  else if (score >= 70 && score <= 79){
    return 'C';
  }
  else if (score >= 60 && score <= 69){
    return 'D';
  }
  else if (score >= 0 && score <= 59){
    return 'F';
  }
  else {
    return 'INVALID SCORE'
  }
}

function convertScoreToGradeWithPlusAndMinus(score) {
  // your code here
  if(score >= 90 && score <= 100){
    if(score >= 90 && score <= 92){
      return 'A-';
    }
    else if(score >= 98 && score <= 100){
      return 'A+';
    }
    else {
      return 'A';
    }


  }
  else if (score >= 80 && score <= 89){
    if(score >= 80 && score <= 82){
      return 'B-';
    }
    else if(score >= 88 && score <= 89){
      return 'B+';
    }
    else {
      return 'B';
    }
  }
  else if (score >= 70 && score <= 79){
        if(score >= 70 && score <= 72){
      return 'C-';
    }
    else if(score >= 78 && score <= 79){
      return 'C+';
    }
    else {
      return 'C';
    }
  }
  else if (score >= 60 && score <= 69){
        if(score >= 60 && score <= 62){
      return 'D-';
    }
    else if(score >= 68 && score <= 69){
      return 'D+';
    }
    else {
      return 'D';
    }
  }
  else if (score >= 0 && score <= 59){
    return 'F';
  }

  else {
    return 'INVALID SCORE';
  }
}

function computeCompoundInterest(principal, interestRate, compoundingFrequency, timeInYears) {
  // your code here
  return (principal*Math.pow((1+(interestRate/compoundingFrequency)),compoundingFrequency*timeInYears)) - principal;
}

Modulo :
  if (isNaN(num1)) return NaN;

  var mod = 0;
  if (Math.abs(num1) > 0) {
    var d = Math.floor(Math.abs(num1) / Math.abs(num2));
    mod = Math.abs(num1) - (Math.abs(num2) * d)
  }

  if (num1 < 0)
    mod = -1 * mod;

  return mod;


