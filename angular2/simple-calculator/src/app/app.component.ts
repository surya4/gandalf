import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  cls = false;
  input: any = 0;
  dotAdded = false;
  operAdded = false;
  output = [];
  oper1: any = '';
  ans: number = 0;
  i: number;
  val2: number;
  display: any = 0;

  constructor() {

  }

  concat(val: any) {
    if (this.operAdded === true) {
      this.operAdded = false;
      this.input = 0;
      this.dotAdded = false;
    }
    if (val == '.') {
      if (this.dotAdded === false) {
        this.dotAdded = true;
        this.input += val;
        this.display += val;

      }
    } else {
      this.input += val;
      this.display += val;
    }
    this.cls = false;
  }

  operator(oper: any) {
    if (oper == '-' && this.input == 0) {
      this.input = '-';
      this.display = '-';
    } else {
      this.display += oper;
      this.output.push(Number(this.input));
      this.output.push(oper);
      this.operAdded = true;
    }

  }

  clearScreen() {
    this.input = 0;
    this.operAdded = false;
    this.dotAdded = false;
    this.output = [];
    this.display = 0;
  }

  clearLast(){
    // yet to build
    this.output.pop();
  }

  calculate() {
    this.output.push(Number(this.input));
    for (this.i = 0; this.i < this.output.length; this.i++) {
      if (this.output[this.i] === '+' ||
            this.output[this.i] === '-' ||
            this.output[this.i] === '*' ||
            this.output[this.i] === '/') {
      this.oper1 = this.output[this.i];
      }
      else {
        if (this.i == 0) {
            this.ans = this.output[this.i];
        } else {
          this.ans = this.getValue(this.ans,this.oper1,this.output[this.i]);
        }
      }
    }
    this.display = this.ans;
    }

  getValue(a: number, op: any, b: number) {
    if (op === '+') {
      return a + b;
    }
    else if (op === '-') {
      return a - b;
    }
    else if (op === '*') {
      return a * b;
    }
    else {
      return a / b;
    }
  }
}
