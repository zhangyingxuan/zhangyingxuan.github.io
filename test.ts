interface ITest {
  a: string;
  [b: string]: any;
  readonly c: number;
}

const test: ITest = {
  a: "1",
  b: "2",
  c: 33,
  d: "4",
};

// test.c = 4;

var arr: (number | string)[] = [1, 2, 3, '4'];

var arrType: Array<number | string> = [1, 2, 3, '4'];

interface IArray {
  [index: number]: number;
}

var arr2: IArray = [1, 2, 3];

interface IFuncType {
  (name: string, age: number): number
}
var func: IFuncType = (name: string, age: number) => {
  return 1;
}

function func2(name: string, age: number): number {
  return 1;
}

enum WeekDays {
  SUN,
  MON,
  TUE,
  WED,
  THU,
  FRI,
  SAT,
}
class Person {
  name = "张三";
  age = 18;
  sayHello() {
    console.log("hello");
  }
}

interface ICreateArr {
  <T>(length: number, value: T): Array<T>;
}


const t1: [string, number, string] = ['1', 2, '3']
'5'.padStart(2, '0')