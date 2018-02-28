"use strict"

function object(prototype) {
  function F() {}
  F.prototype = prototype;
  return new F();
}

function inheritPrototype(SubType, SuperType) {
  let prototype = object(SuperType.prototype);
  prototype.constructor = SubType;
  SubType.prototype = prototype;
}

function Animal(name, age, type) {
  this.name = name;
  this.age = age;
  this.type = type;
}

Animal.prototype.sayHi = function () {
  console.log(`hi, I am ${this.name}`);
};

function Cat(name, age) {
  Animal.call(this, name, age, 'Cat');
}

inheritPrototype(Cat, Animal);

let tom = new Cat('tom', 18);
let jack = new Cat('jack', 21);
