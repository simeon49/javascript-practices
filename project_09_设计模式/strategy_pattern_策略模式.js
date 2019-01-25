/**
 * strategy pattern: 策略模式
 */


class Context {
  constructor() {
    this.strategy = null;
  }

  algorithm() {
    if (!this.strategy) {
      throw Error('请调用setStrategy设置strategy!');
    }
    this.strategy.algorithm();
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }
}

class Strategy {
  algorithm() {
    throw Error('请实现Strategy继承类的algorithm方法!');
  }
}

class ConcreteStrategyA extends Strategy {
  algorithm() {
    console.log("Strategy A");
  }
}

class ConcreteStrategyB extends Strategy {
  algorithm() {
    console.log("Strategy B");
  }
}


function main() {
  const cxt = new Context();

  const s1 = new ConcreteStrategyA();
  cxt.setStrategy(s1);
  cxt.algorithm();


  const s2 = new ConcreteStrategyB();
  cxt.setStrategy(s2);
  cxt.algorithm();
}
main();
