var student1 = {};
student1.first_name = "Abra";
student1.last_name = "Singh";
student1.roll_num = 34;

var student2 = {};
student2.first_name = "Dabra";
student2.last_name = "Singh";
student2.roll_num = 14;

console.log(student1);
console.log(student1.first_name);
console.log(student2["first_name"]);

function createStudentsObject(first_name,last_name,roll_num) {
    var studentObject = {};
    studentObject.first_name = first_name;
    studentObject.last_name = last_name;
    studentObject.roll_num = roll_num;
    return studentObject;
}

var student3 = createStudentsObject("Tambola","Singh",15);
console.log(student3);

// Using Constructors

function CreateStudentsObjectUsingConstructors(first_name,last_name,roll_num) {
    // var this = {};
    this.first_name = first_name;
    this.last_name = last_name;
    this.roll_num = roll_num;
    this.seat = function(){
        this.roll_num += 3;
    }
    // return this;
}

var student4 = new CreateStudentsObjectUsingConstructors("Tambola","Singh",15);
var student5 = new CreateStudentsObjectUsingConstructors("Kapoda","Singh",25);
student5.seat();

console.log(student4);
console.log(student4.first_name);
console.log(student5);

function Teacher(name) {
    this.name = name;
}

var mike = new Teacher("mike");
mike.seat = student4.seat;
mike.seat.call(student4);
console.log(student4);