// 参考: https: //segmentfault.com/a/1190000007535316
// 一句话， async 函数就是 Generator 函数的语法糖。是js 异步处理的终极解决方案

function takeSomeTime(n) {
  return new Promise((resolve, reject) => {
    if (n < 0) {
      return reject("n 值必须大于等于0!");
    } else {
      setTimeout(() => {
        return resolve(n);
      }, n * 1000);
    }
  });
}

start = Date.now();
console.log("========= start =========");

// ====================== 基本用法: ======================
var a = await takeSomeTime(1)
  , b = await takeSomeTime(2)
  , c = await takeSomeTime(-1).catch(err => {console.log(`截获一个错误: ${err}`)});

console.log(`${a} + ${b} = ${a + b}`);



// ====================== 上面的做法会阻塞后面的执行, 可以吧await包含于async中 ======================
async function noBlockFunc01() {
  const a = await takeSomeTime(1)
    , b = await takeSomeTime(2)
    , c = await takeSomeTime(-1).catch(err => {console.log(`截获一个错误: ${err}`)});

  console.log(`${a} + ${b} = ${a + b}`);
}
noBlockFunc01();


console.log("========= end =========");
console.log(`time use: ${Date.now() - start}`);
