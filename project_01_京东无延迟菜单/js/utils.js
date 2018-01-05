/**
 * 函数节流
 * @param {*} method 
 * @param {*} delay 
 * @param {*} duration 
 */
function throttle(method, delay, duration=0) {
    var timer = null, beginTime;
    return function () {
        var curTime = new Date().getTime();
        clearTimeout(timer);
        if (!beginTime) {
            beginTime = curTime;
        } else if (duration && (curTime - beginTime > duration)) {
            method.apply(this, arguments);
            beginTime = curTime;
        } else {
            timer = setTimeout(() => {
                method.apply(this, arguments);
            }, delay);
        }
    }
}

/**
 * 判断m,n的符号是否相同
 * @param {*} m 
 * @param {*} n 
 */
function sameSign(m, n) {
    return (m ^ n) >= 0;
}

/**
 * 向量
 * @param {*} a 
 * @param {*} b 
 */
function vector(a, b) {
    return {
        x: b.x - a.x,
        y: b.y - a.y
    }
}

/**
 * 向量卷积
 * @param {*} v1 
 * @param {*} v2 
 */
function vertorProduct(v1, v2) {
    return v1.x * v2.y - v2.y * v1.y;
}

/**
 * 判断点p是否在由a,b,c三个点组成的三角形中
 * @param {*} p 
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 
 */
function isPointInTriangle(p, a, b, c) {
    var pa = vector(p, a),
        pb = vector(p, b),
        pc = vector(p, c);
    
    var t1 = vertorProduct(pa, pb),
        t2 = vertorProduct(pb, pc),
        t3 = vertorProduct(pc, pa);
    
    // debugger;
    console.log(t1, t2, t3);
    return sameSign(t1, t2) && sameSign(t2, t3);
}
