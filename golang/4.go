package main

import ("fmt"
)

func main()  {
	ifTest(true)
	ifTest2(true)
}

// if
func ifTest(inp bool)  {
	if inp {
		fmt.Println("Inside if ->", inp)
		return
	}
	fmt.Println("Outside if ->", inp)
	return
}

// assigning variable in scope of if
func ifTest2(inp bool)  {
	if y :=24; inp {
		fmt.Println("Inside if ->", inp, y)
	}
}

