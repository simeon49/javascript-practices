let count = 0;
for (let i; i < 9999999999999; i ++) {
    if (i % 5 === 0) {
        continue;
    }
    count ++;
}
console.log(performance.now(), 'S1 完成');