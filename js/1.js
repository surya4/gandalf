var Employee = function (first_name,last_name,age) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.age = age;
    this.talk = function () {
        console.log("Hi");
    }
}

// Employee('Rama',23);

var sita = new Employee('Sita','Mohan',23);
var radha = new Employee('Radha','Charan',43);

// {ObjetName}.prototype.{mentodName}
Employee.prototype.full_name = function () {
    return this.first_name + " " + this.last_name;
}

Employee.prototype.hasDaughter = function () {
    return this.age > 25;
}

console.log(sita.full_name());
console.log(radha.full_name());

console.log(sita.hasDaughter());
console.log(radha.hasDaughter());



console.log("-------------------------- --------------------------------");

var Manager = function (first_name,last_name,age, dept) {
    Employee.call(this,first_name,last_name,age);
    this.dept = dept;
}
Manager.prototype = new Employee();

// Manager.prototype = Object.create(Employee.prototype);
var madhu = new Manager('Madhu','Bala',34,'Tech');
console.log(madhu);

Manager.prototype.constructor = Manager;
console.log(madhu);

console.log(Manager.prototype.isPrototypeOf(madhu));
console.log(Employee.prototype.isPrototypeOf(madhu));

Manager.prototype.setMeeting = function(){
    return new Date();
}
console.log(madhu.setMeeting());

console.log("-------------------------- --------------------------------")

var Para = function (item) {
    this.item =  item;
    this.doubleValue = function () {
        return 2 * this.item;
    }
}

let p = new Para(12);

console.log("p ->", p)
console.log("p.doubleValue() ->", p.doubleValue())

Para.prototype.doubleValue = function () {
    return this.item + 2;
}

console.log("p ->", p)
console.log("p.doubleValue() ->", p.doubleValue())

console.log("-------------------------- --------------------------------")

var Abra = function () {
    this.item = true;
}

var Dabra = function (item2, item3) {
    Abra.call(this);

    this.item = item2;
    this.item3 = item3;
}

console.log("Dabra", Dabra);
console.log("new Abra", new Abra());
console.log("new Dabra", new Dabra(3,4));

Dabra.prototype = Object.create(Abra.prototype);
Dabra.prototype.constructor = Dabra;

var dabraOut = new Dabra(7,8);
console.log("dabraOut", dabraOut)