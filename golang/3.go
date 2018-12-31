package main

import ("fmt"
)

type User struct {
	id int
	name string
}

func userDetails(user User) {
	fmt.Println("userDetails ->", user.id, user.name)
	fmt.Println("aboutUser ->",aboutUser(user.id, user.name))
	inp1, inp2 := aboutUser2(user.id, user.name)
	fmt.Println("aboutUser2 inp1 ->",inp1)
	fmt.Println("aboutUser2 inp2 ->", inp2)

	// ignoring input message in multiple return
	_, inp3 := aboutUser2(user.id, user.name)
	fmt.Println("aboutUser2 inp3 ->", inp3)

	inp4, inp5 := aboutUser3(user.id, user.name)
	fmt.Println("aboutUser2 inp4 ->",inp4)
	fmt.Println("aboutUser2 inp5 ->", inp5)

	fmt.Println("aboutUser4 ->",aboutUser4(user.id, user.name, "hallelujah"))
}



func main() {
	var s = User{1234, "Abra"}
	userDetails(s)
	aboutUser5("Abra ka dabra", customPrint) 
}

// return function 
func aboutUser(id int, name string) string {
	return "My id is " + fmt.Sprintf("%v",id) + ". My name is " + name;
}

// return multiple values from a function
func aboutUser2(id int, name string) (string, string) {
	return "My name is " + name, "My id is " + fmt.Sprintf("%v",id) 
}

// named return function 
func aboutUser3(id int, name string) (msg1 string, msg2 string) {
	msg1 = "My id is " + fmt.Sprintf("%v",id);
	msg2 = ". My name is " + name;
	return
	// both ways works
	// return msg1, msg2
}

// variadic function, function with multiple paramaters
func aboutUser4(id int, name ...string) (string) {
	return "My id is " + fmt.Sprintf("%v",id) + "My name is " + name[0] + ". My name is also " + name[1] 
}

// custom function pasing in another function
func aboutUser5(name string, customFunc func(string)) {
	customFunc("helllo " + name)
}

func customPrint(inp string) {
	fmt.Println("Custome print function called from another function. inp ->", inp)
}

// function type
type CustomePrinter func (string) {}
func aboutUser5(name string, type CustomePrinter) {
	customFunc("helllo " + name)
}