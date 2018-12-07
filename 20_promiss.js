function foo() {
  return new Promise((resolve, reject) => {
    resolve("A");
  });
}

foo().then(res => {
  console.log(`get res: ${res}`);
  // throw new Error("oh, error!");
  return "B";
}).then(res => {
  console.log(`get res: ${res}`);
  return "C"
}).then(res => {
  console.log(`get res: ${res}`);
  throw new Error("oh, error!");
}).catch(err => {
  console.error(`get err: ${err}`);
});

