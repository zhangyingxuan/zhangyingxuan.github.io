---
title: 2023-12-05-Typescript学习
description:
categories:
  - 工程化
tags:
---

1. 为对象赋值未定义的变量

```ts
interface IObject {
  a: string;
  [b: string]: any;
  readonly c: string;
}
var obj: IObject = { a: "1", b: 2, c: "4", d: true };
```

2. 联合类型函数重载

```ts
function func(value: number): number;
function func(value: string): string;
function func(value: number | string): number | string {
  return value;
}
let a: number = func(1);
let b: string = func("1");
```

3. 类型断言，只能断言联合类型中的类型

```ts
function getAssert(name: string | number) {
  // return (<string>name).length;
  // jsx中必须使用 as，<>有解析问题
  return (name as string).length;
}
```

4. 类型别名 type

```ts
type Type0 = string | number;
type Sex = "男" | "女";
interface IType1 {
  name: string;
}
interface IType2 {
  age: string;
}
function getSex(sex: Sex) {
  return sex;
}
type Type3 = IType1 | IType2;
var a: Type3 = { name: "张三" };
var b: Type3 = { age: 18 };
var b: Type3 = { name: "李四", age: 12 };
getSex("男");
```

5. 枚举，会被编译为一个双向映射的对象

```ts
enum Days {
  SUN,
  MON,
  WED,
  THU,
  WED,
  FRI,
  SAT,
}
```

6. 类的修饰符，public prvate protected(仅子类可访问)，static

```ts
class Person {
  name = "张三";
  protected age = 18;
}
```

7. 泛型，帮助限定约束规范

```ts
// 方法中的泛型
function createArray<T>(len: number, value: T): Array<T> {
  let arr = [];
  for (var i = 0; i < len; i++) {
    arr[i] = value;
  }
  return arr;
}
// 接口中的泛型
```

8. 元组

```ts
const t1: [string, number, string] = ["1", 2, "3"];
```

9.
