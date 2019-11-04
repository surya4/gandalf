package main

import ("fmt"
"math"
)

func main() {
	// int
	var int_10, int_11 int = 1234, 234
	var int_20 int8 = math.MinInt8
	var int_21 int8 = math.MaxInt8
	var int_30 int16 = math.MinInt16
	var int_31 int16 = math.MaxInt16
	var int_40 int32 = math.MinInt32
	var int_41 int32 = math.MaxInt32
	var int_50 int64 = math.MinInt64
	var int_51 int64 = math.MaxInt64

	fmt.Println("int value ->", int_10, int_11)
	fmt.Println("int8 scope ->", int_20, int_21)
	fmt.Println("int16 scope ->", int_30, int_31)
	fmt.Println("int32 scope ->", int_40, int_41)
	fmt.Println("int64 scope ->", int_50, int_51)

	// unsigned int
	var uint_1 uint = 1234
	var uint_2 uint8 = math.MaxUint8
	var uint_3 uint16 = math.MaxUint16
	var uint_4 uint32 = math.MaxUint32
	var uint_5 uint64 = math.MaxUint64
	// var uint_6 uintptr = 

	fmt.Println("uint value ->", uint_1)
	fmt.Println("uint8 scope ->", uint_2)
	fmt.Println("uint16 scope ->", uint_3)
	fmt.Println("uint32 scope ->", uint_4)
	fmt.Println("uint64 scope ->", uint_5)
	// fmt.Println("uintptr scope ->", uint_6)

	// boolean
	var bool_1 bool = false
	fmt.Println("bool scope ->", bool_1)

	// string
	var str_1 string = "qwertyuiopasdfghjklzxcvbnm"
	fmt.Println("string scope ->", str_1)

	// byte === uint8
	var byte_1 byte = 255
	fmt.Println("byte_1 scope ->", byte_1)

	// rune === int32 char
	var rune_1 rune = 'A'
	fmt.Println("rune scope ->", rune_1)

	// floats
	var float_1 float32 = math.MaxFloat32
	var float_2 float64 = math.MaxFloat64
	fmt.Println("float32 scope ->", float_1)
	fmt.Println("float64 scope ->", float_2)

	// complex numbers which have float32/float64 real and imaginary parts 
	var complex_1 complex64 = 3.4028235e+38 + 3.4028235e+38i
	var complex_2 = complex(math.MaxFloat64, math.MaxFloat64)
	fmt.Println("complex32 scope ->", complex_1)
	fmt.Println("complex64 scope ->", complex_2)

	// array
	var arr1 [3]int;
	arr1[0] = 1; arr1[1] = 2; arr1[2] = 3;
	var arr2 = [3]int{4, 5, 6}
	arr3 := [3]int{7, 8, 9}

	fmt.Println("arr1 ->", arr1)
	fmt.Println("arr2 ->", arr2)
	fmt.Println("arr3 ->", arr3)

	// slice
	var slice1 []int = arr1[1:2]
	slice2 := []int{7, 8, 9}
	// creates a slice which contains all elements of the array
	slice3 := arr1[:]
	// creating a slice using make
	slice4 := make([]int, 5, 5)
	slice4[2] = 2
	// append slices 
	slice5 := append(slice1, slice2...)
	slice6 := [][]int {{1,2},{3,4},{5,6},}

	fmt.Println("slice1 ->", slice1)
	fmt.Println("slice2 ->", slice2)
	fmt.Println("slice3 ->", slice3)
	fmt.Println("slice4 ->", slice4)
	fmt.Println("slice5 ->", slice5)
	fmt.Println("slice6 ->", slice6)

	// pointers
	var int_12 int = 1234
	var pointer_1 *int = &int_12
	fmt.Println("pointers ->", pointer_1, *pointer_1);

	// reassign value of pointer
	*pointer_1 = 98765;
	fmt.Println("pointers ->", pointer_1, *pointer_1);
	
	// struct
	// if type name startes with capital letter e.g. Abra it's public outside package else not (abra)
	type Abra struct {
		name string
		id int
		message string
	}

	var p = Abra{"Dabra", 123, "Hakuna matatat 1"}
	var q = Abra{
		id: 456,
		name: "Dabra", 
		message: "Hakuna matatat 2",
	}
	var r = Abra{}
	r.name = "Dabra"
	r.id = 789
	r.message = "Hakuna matatat 3"

	fmt.Println("struct Abra name ->", p.name, q.name, q.name);
	fmt.Println("struct Abra id ->", p.id, q.id, r.id);
	fmt.Println("struct Abra message ->", p.message, q.message, r.message);

	// constants
	const (
		PI = 3.14
		mm = "1234"
		D = iota
	)

	const (
		A = iota
		B = iota
		C
	)

	fmt.Println("constants ->", PI, mm, D);
	fmt.Println("serial iota constants ->", A, B, C);

}